import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  className?: string;
};

export default function Pill({ children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-lg bg-stone-100 px-3 py-1 text-sm text-stone-600 ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}
