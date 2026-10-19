import { useCallback, useEffect, useState } from "react";
import type { Incident, NewIncident } from "../types";
import { createIncident, listIncidents } from "../api";

export const useIncidents = (filters: { q?: string; tag?: string } = {}) => {
  const { q, tag } = filters;
  const [items, setItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Bumping the key re-runs the effect below with the current filters
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    // Set on cleanup so a slow, outdated request can't overwrite newer results
    let ignore = false;

    async function load() {
      try {
        const data = await listIncidents({ q, tag });
        if (!ignore) {
          setItems(data);
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
  }, [q, tag, reloadKey]);

  const create = async (data: NewIncident) => {
    const res = await createIncident(data);
    setItems((prev) => [res, ...prev]);
    return res;
  };

  return { items, loading, error, create, refresh };
};
