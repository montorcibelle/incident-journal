import { useEffect, useMemo, useState } from "react";
import type { Incident, NewIncident } from "../types";
import { createIncident, listIncidents } from "../Api";

export const useIncidents = (q = "") => {
  const [allItems, setAllItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set on cleanup so a slow, outdated request can't overwrite newer results
    let ignore = false;

    async function load() {
      try {
        const data = await listIncidents();
        if (!ignore) {
          setAllItems(data);
          setError(null);
        }
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const create = async (data: NewIncident) => {
    const res = await createIncident(data);
    setAllItems((prev) => [res, ...prev]);
    return res;
  };

  // Filter locally: keep incidents with at least one tag containing the search text
  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allItems;
    return allItems.filter((i) =>
      i.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  }, [allItems, q]);

  return { items, loading, error, create };
};
