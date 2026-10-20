import { useState } from "react";
import IncidentCard from "../components/IncidentCard";
import SearchInput from "../components/SearchInput";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useIncidents } from "../hooks/useIncidents";

export default function IncidentsPage() {
  const [query, setQuery] = useState("");
  // Wait until the user pauses typing before filtering
  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const { items, loading, error } = useIncidents(debouncedQuery);

  return (
    <div className="flex flex-col gap-4">
      <search>
        <SearchInput value={query} onChange={setQuery} />
      </search>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {/* Announced by screen readers when the results change */}
      <p role="status" className="text-sm text-stone-600">
        {loading
          ? "Loading incidents…"
          : `${items.length} ${items.length === 1 ? "incident" : "incidents"} found`}
      </p>

      {items.map((item) => (
        <IncidentCard key={item.id} incident={item} />
      ))}
    </div>
  );
}
