import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../lib/api';

interface ApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/** Fetches a GET endpoint when the component mounts or the path changes. */
export function useApi<T>(path: string) {
  const [state, setState] = useState<ApiState<T>>({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));
    api<T>(path).then(
      (data) => !cancelled && setState({ data, error: null, loading: false }),
      (error) => !cancelled && setState({ data: null, error: errorMessage(error), loading: false }),
    );
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  /** Updates the cached response after a successful mutation, without refetching. */
  const mutate = useCallback((update: (current: T | null) => T | null) => {
    setState((current) => ({ ...current, data: update(current.data) }));
  }, []);

  return { ...state, reload, mutate };
}
