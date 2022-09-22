import { MapPayload, MapPayloadResponse } from "models/api.model";
import useApi from "./useApi";
import ENV from "AppEnv";
import { useCallback, useState } from "react";

const useHackApi = () => {
  const { execute, error, isFetching } = useApi();

  const [drawnImageResponse, setDrawnImageResponse] = useState<
    boolean | undefined
  >();

  const resetResponses = useCallback(() => {
    setDrawnImageResponse(undefined);
  }, []);

  const patchShapes = useCallback(
    async (payload: MapPayload) => {
      resetResponses();
      try {
        const [json_response] = await execute(ENV.shapes, "POST", payload);
        setDrawnImageResponse(!!json_response);
        return json_response as unknown as MapPayloadResponse;
      } catch (e: unknown) {
        setDrawnImageResponse(undefined);
        return undefined;
      }
    },
    [execute, resetResponses]
  );

  return {
    patchShapes,
    drawnImageResponse,
    isFetching,
    error,
  };
};

export default useHackApi;
