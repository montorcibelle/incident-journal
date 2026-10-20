import { useId } from "react";

export const inputClass =
  "block w-full rounded-lg border border-stone-400 bg-white px-3 py-2 text-[1rem] text-stone-900 sm:text-sm placeholder:text-stone-500 focus-visible:border-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  multiline?: boolean;
  mono?: boolean;
  hint?: string;
  error?: string;
};

export default function Field({
  label,
  value,
  onChange,
  required,
  multiline,
  mono,
  hint,
  error,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const shared = {
    id,
    value,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${inputClass} ${mono ? "font-mono" : ""} ${error ? "border-red-700" : ""}`,
  };

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold text-stone-800">
        {label}
        {required && <span className="font-normal text-stone-600"> (required)</span>}
      </label>
      <div className="mt-1">
        {multiline ? (
          <textarea
            {...shared}
            rows={3}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            {...shared}
            type="text"
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-stone-600">
          {hint}
        </p>
      )}
    </div>
  );
}
