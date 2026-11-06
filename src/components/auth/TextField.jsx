import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputBase =
  "h-12 w-full rounded-md border bg-white text-[15px] text-ink placeholder:text-body/70 outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15";

export function FieldLabel({ htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {required && <span className="text-brand-600"> *</span>}
    </label>
  );
}

export function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600">
      {children}
    </p>
  );
}

/** Labelled input with an optional left icon (a lucide component). */
export function TextField({ id, label, icon: Icon, error, required, className = "", ...inputProps }) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-body"
            aria-hidden
          />
        )}
        <input
          id={id}
          name={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} ${Icon ? "pl-11" : "pl-4"} pr-4 ${
            error ? "border-red-500" : "border-line"
          }`}
          {...inputProps}
        />
      </div>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField({ id, label, error, required, className = "", ...inputProps }) {
  const [visible, setVisible] = useState(false);
  const Toggle = visible ? Eye : EyeOff;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} pl-4 pr-12 ${error ? "border-red-500" : "border-line"}`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-body hover:text-ink"
        >
          <Toggle className="h-4.5 w-4.5" aria-hidden />
        </button>
      </div>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}