import { useEffect, useMemo, useState } from "react";
import type { Incident } from "../types";
import { listIncidents } from "../Api";

export const useIncidents = (q = "") => {
  const [allItems, setAllItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listIncidents();
        setAllItems(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  //filtering is client-side and by tag-only
  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allItems;
    return allItems.filter((i) =>
      i.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  }, [allItems, q]);

  return { items, loading, error };
};
