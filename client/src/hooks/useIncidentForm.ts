import { useState, type SubmitEvent } from "react";
import { createIncident, structureNotes } from "../Api";
import { NOTES_MAX_LENGTH, parseTags, validateForm } from "../helpers";
import type { FieldErrors, FormData } from "../types";

const emptyForm: FormData = {
  notes: "",
  title: "",
  symptom: "",
  root: "",
  fix: "",
  impact: "",
  tags: "",
};

type Status = { type: "idle" } | { type: "success" } | { type: "error"; message: string };

export const useIncidentForm = () => {
  const [values, setValues] = useState<FormData>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [aiLoading, setAiLoading] = useState(false);

  // Called on every keystroke: saves the new value for `field`, clears that field's
  const updateField = (field: keyof FormData, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors((errs) => ({ ...errs, [field]: undefined }));
    setStatus({ type: "idle" });
  };

  const structureWithAI = async () => {
    if (values.notes.trim().length < 10) {
      setStatus({ type: "error", message: "Add a few more notes first" });
      return;
    }
    if (values.notes.trim().length > NOTES_MAX_LENGTH) {
      setStatus({
        type: "error",
        message: `Notes are too long (max ${NOTES_MAX_LENGTH.toLocaleString()} characters)`,
      });
      return;
    }

    setAiLoading(true);
    setStatus({ type: "idle" });
    try {
      const draft = await structureNotes(values.notes);
      setValues((v) => ({
        ...v,
        title: draft.title,
        symptom: draft.symptom,
        root: draft.root ?? "",
        fix: draft.fix ?? "",
        impact: draft.impact ?? "",
        tags: draft.tags.join(", "),
      }));
      setFieldErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "AI is unavailable, please fill in the fields manually",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle" });
    try {
      await createIncident({
        title: values.title,
        symptom: values.symptom,
        root: values.root || undefined,
        fix: values.fix || undefined,
        impact: values.impact || undefined,
        tags: parseTags(values.tags),
      });
      setValues(emptyForm);
      setStatus({ type: "success" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save incident",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    fieldErrors,
    submitting,
    status,
    aiLoading,
    updateField,
    handleSubmit,
    structureWithAI,
  };
};
