// Hydration-safe hook for Zustand persisted stores
// Prevents SSR/client mismatch by returning undefined until mounted

import { useState, useEffect } from "react";

/**
 * Wraps a Zustand store selector to be hydration-safe.
 * Returns `undefined` on the server and during initial client render,
 * then the actual store value after hydration.
 */
export function useHydrated<T>(selector: () => T): T | undefined {
  const [hydrated, setHydrated] = useState(false);
  const value = selector();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? value : undefined;
}
