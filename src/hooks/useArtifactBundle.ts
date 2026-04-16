import { useEffect, useState } from "react";

import { loadArtifactBundle } from "@/services/artifactService";
import type { ArtifactBundle } from "@/types/artifacts";

interface ArtifactBundleState {
  data: ArtifactBundle | null;
  error: string | null;
  isLoading: boolean;
}

export function useArtifactBundle() {
  const [state, setState] = useState<ArtifactBundleState>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const data = await loadArtifactBundle();
        if (!cancelled) {
          setState({ data, error: null, isLoading: false });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            error:
              error instanceof Error
                ? error.message
                : "Unable to load research artifacts.",
            isLoading: false,
          });
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
