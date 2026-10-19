import { useId } from "react";
import { inputClass } from "./Field";

type RawNotesProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RawNotes({ value, onChange }: RawNotesProps) {
  const id = useId();

  return (
    <div className="flex flex-1 flex-col">
      <label htmlFor={id} className="text-sm font-semibold text-stone-800">
        Raw notes
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} mt-1 min-h-64 flex-1 resize-y rounded-xl lg:min-h-96`}
      />
    </div>
  );
}
