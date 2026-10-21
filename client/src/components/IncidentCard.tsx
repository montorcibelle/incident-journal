import { formatDate } from "../helpers";
import type { Incident } from "../types";
import Pill from "./Pill";

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </h3>
      <p className="mt-1 wrap-break-word text-stone-800">{value ?? "—"}</p>
    </div>
  );
}

export default function IncidentCard({ incident }: { incident: Incident }) {
  const { title, symptom, root, fix, impact, tags, createdAt } = incident;

  return (
    <article className="w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h2 className="text-lg font-bold text-stone-900">{title}</h2>
        <time className="shrink-0 text-sm text-stone-500">
          {formatDate(createdAt)}
        </time>
      </header>

      <p className="mt-4 whitespace-pre-wrap wrap-break-word rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800">
        {symptom}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        <Field label="Root cause" value={root} />
        <Field label="Fix" value={fix} />
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-x-8 gap-y-3 border-t border-stone-200 pt-4 sm:grid-cols-2">
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="min-w-0 max-w-full">
              <Pill>{tag}</Pill>
            </li>
          ))}
        </ul>
        {impact && (
          <p className="wrap-break-word text-sm font-semibold text-stone-900 sm:text-right">
            Impact: {impact}
          </p>
        )}
      </div>
    </article>
  );
}
