import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button, FormError } from "./ui";
import { Field } from "./controls";

/** Centred dialog. Closes on Escape or a click on the dark backdrop. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  // Always call the latest onClose without re-running the effect below.
  // (Updated in an effect: writing a ref during render is not allowed.)
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    // Focus the first field when the dialog opens (only once, not on every re-render)
    panelRef.current?.querySelector("input, textarea, select")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const width = { md: "max-w-lg", lg: "max-w-3xl" }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${width}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-body">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-body hover:bg-canvas"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Confirmation for risky actions that need a recorded reason
 * (suspend company, revoke access...). `onConfirm(reason)` should return
 * true when it worked, so the dialog closes.
 */
export function ReasonDialog({
  open,
  onClose,
  title,
  description,
  ...formProps
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <ReasonForm onClose={onClose} {...formProps} />
    </Modal>
  );
}

function ReasonForm({
  onClose,
  onConfirm,
  busy,
  error,
  confirmLabel,
  variant = "danger",
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!reason.trim()) return;
    if (await onConfirm(reason.trim())) onClose();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field
        label="Reason (recorded in the audit log)"
        multiline
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain why this change is needed…"
        error={touched && !reason.trim() ? "A reason is required." : undefined}
      />
      <FormError>{error}</FormError>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant={variant} loading={busy}>
          {confirmLabel}
        </Button>
      </div>
    </form>
  );
}
