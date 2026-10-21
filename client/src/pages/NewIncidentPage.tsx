import { Link } from "react-router";
import type { DraftName } from "../types";
import Field from "../components/Field";
import Pill from "../components/Pill";
import RawNotes from "../components/RawNotes";
import { parseTags } from "../helpers";
import { useIncidentForm } from "../hooks/useIncidentForm";

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-2 font-mono text-sm font-semibold text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 disabled:cursor-not-allowed disabled:opacity-60";

type DraftField = {
  name: DraftName;
  label: string;
  required?: boolean;
  multiline?: boolean;
  mono?: boolean;
  hint?: string;
  half?: boolean;
};

const draftFields: DraftField[] = [
  { name: "title", label: "Title", required: true },
  {
    name: "symptom",
    label: "Symptom",
    required: true,
    multiline: true,
    mono: true,
  },
  { name: "root", label: "Root cause", multiline: true, half: true },
  { name: "fix", label: "Fix", multiline: true, half: true },
  { name: "impact", label: "Impact" },
  {
    name: "tags",
    label: "Tags",
    hint: "Separate tags with commas, e.g. database, deploy",
  },
];

export default function NewIncidentPage() {
  const {
    values,
    fieldErrors,
    submitting,
    status,
    aiLoading,
    updateField,
    handleSubmit,
    structureWithAI,
  } = useIncidentForm();
  // "id, symptom, title" => ["id","symptom"]
  const tagList = parseTags(values.tags);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-stone-900">Log an incident</h1>
        <p className="mt-1 text-sm text-stone-700">
          Paste whatever you have: a Slack thread, a post-mortem, rough notes. The AI drafts the
          fields, and you review before anything is saved.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
        <section className="flex flex-col gap-4">
          <RawNotes value={values.notes} onChange={(v) => updateField("notes", v)} />
          <button
            type="button"
            onClick={structureWithAI}
            disabled={aiLoading}
            className={`${primaryButtonClass} self-start`}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
            </svg>
            {aiLoading ? "Structuring…" : "Structure with AI"}
          </button>
        </section>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="text-base font-bold text-stone-900">Draft</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {draftFields.map(({ name, half, ...fieldProps }) => (
              <div key={name} className={`min-w-0 ${half ? "" : "sm:col-span-2"}`}>
                <Field
                  {...fieldProps}
                  value={values[name]}
                  onChange={(v) => updateField(name, v)}
                  error={fieldErrors[name]}
                />
                {name === "tags" && tagList.length > 0 && (
                  <ul aria-label="Tag preview" className="mt-2 flex flex-wrap gap-2">
                    {tagList.map((tag, i) => (
                      <li key={`${tag}-${i}`} className="max-w-full min-w-0">
                        <Pill>{tag}</Pill>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {status.type === "error" && (
            <p role="alert" className="text-sm font-semibold text-red-700">
              {status.message}
            </p>
          )}

          {status.type === "success" && (
            <div
              role="status"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-green-700 bg-green-50 px-4 py-3 text-sm text-green-900"
            >
              <p className="font-semibold">Incident created successfully.</p>
              <Link to="/" className="font-semibold underline">
                View all incidents
              </Link>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-4">
            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting ? "Saving…" : "Save incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
