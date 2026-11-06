import { useRef } from "react";

/**
 * Row of single-digit boxes for a one-time code.
 * `value` is an array of strings, one per box ("" when empty), so a gap in the
 * middle keeps its position. Typing moves forward, Backspace moves back, the
 * arrow keys move between boxes, and pasting fills every box at once.
 */
export function OtpInput({ value, onChange, error, disabled, autoFocus }) {
  const inputs = useRef([]);
  const length = value.length;

  const focusBox = (index) => {
    const box = inputs.current[Math.max(0, Math.min(index, length - 1))];
    box?.focus();
    box?.select();
  };

  // Put digits into the boxes starting at `start`, then focus the next empty one
  const fillFrom = (start, digits) => {
    const next = [...value];
    digits.slice(0, length - start).forEach((digit, i) => {
      next[start + i] = digit;
    });
    onChange(next);
    focusBox(start + digits.length);
  };

  const handleChange = (index, e) => {
    const digits = e.target.value.replace(/\D/g, "").split("");
    if (!digits.length) return;
    // Phones can autofill the whole code into one box, so treat it like a paste
    fillFrom(index, digits.length > 1 ? digits : [digits[digits.length - 1]]);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...value];
      if (next[index]) {
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        next[index - 1] = "";
        onChange(next);
        focusBox(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").split("");
    if (digits.length) fillFrom(index, digits);
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-4" role="group" aria-label="Verification code">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={Boolean(error)}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          value={digit}
          placeholder="–"
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-full rounded-lg border bg-white text-center text-2xl font-semibold text-ink caret-brand-600 outline-none transition-colors placeholder:text-line focus:border-2 focus:border-brand-600 focus:placeholder:text-transparent disabled:opacity-60 sm:h-16 ${
            error ? "border-red-500" : digit ? "border-brand-600" : "border-line"
          }`}
        />
      ))}
    </div>
  );
}