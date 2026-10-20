import { useId } from "react";
import { NOTES_MAX_LENGTH } from "../helpers";
import { inputClass } from "./Field";

type RawNotesProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RawNotes({ value, onChange }: RawNotesProps) {
  const id = useId();
  const countId = `${id}-count`;
  const overLimit = value.length > NOTES_MAX_LENGTH;

  return (
    <div className="flex flex-1 flex-col">
      <label htmlFor={id} className="text-sm font-semibold text-stone-800">
        Raw notes
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={countId}
        aria-invalid={overLimit || undefined}
        className={`${inputClass} mt-1 min-h-60 flex-1 resize-y rounded-xl lg:min-h-80 ${overLimit ? "border-red-700" : ""}`}
      />
      <p
        id={countId}
        className={`mt-1 text-sm ${overLimit ? "font-semibold text-red-700" : "text-stone-600"}`}
      >
        {value.length.toLocaleString()} / {NOTES_MAX_LENGTH.toLocaleString()}{" "}
        characters
      </p>
    </div>
  );
}
