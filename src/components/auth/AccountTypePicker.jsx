import { Building2, Handshake, User } from "lucide-react";
import { FieldError } from "./TextField";
import { accountTypes } from "../../data/auth";

const icons = { "Client": User, "Sales Partner": Handshake, "Company Admin": Building2 };

/** Three radio cards: Client, Sales Partner, Company Admin. */
export function AccountTypePicker({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-ink">
        Account Type<span className="text-brand-600"> *</span>
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {accountTypes.map((type) => {
          const Icon = icons[type.value];
          const selected = value === type.value;
          return (
            <label
              key={type.value}
              className={`relative flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors sm:flex-col sm:items-start sm:gap-2.5 ${
                selected
                  ? "border-2 border-brand-600 bg-brand-50/60"
                  : "border-line bg-white hover:border-brand-600/50"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value={type.value}
                checked={selected}
                onChange={() => onChange(type.value)}
                className="peer sr-only"
              />
              <Icon className="h-4.5 w-4.5 text-brand-600" aria-hidden />
              <span className="text-sm text-ink">{type.label}</span>
              {/* Custom radio dot */}
              <span
                className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600/30 ${
                  selected ? "border-brand-600" : "border-line"
                }`}
                aria-hidden
              >
                {selected && <span className="h-2 w-2 rounded-full bg-brand-600" />}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id="accountType-error">{error}</FieldError>
    </fieldset>
  );
}