import { useId } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  label = "Search incidents",
  placeholder = "Search incidents",
}: SearchInputProps) {
  const id = useId();

  return (
    <div>
      {/* Visually hidden, but announced by screen readers; placeholder is not a label */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 size-5 -transtone-y-1/2 text-stone-500"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="block min-h-11 w-full rounded-lg border border-stone-400 bg-white py-2 pl-10 pr-3 text-[1rem] text-stone-900 sm:text-sm placeholder:text-stone-500 focus-visible:border-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        />
      </div>
    </div>
  );
}
