import { useCallback, useMemo, useState } from "react";
import blobStorage from "blobStorage";
import { FINALIZED_BLOB_ID } from "components/ArtBoard/shapes.constants";
import useFileReader from "hooks/useFileReader";
import { WizardStep } from "components/Wizard/wizard.models";
import {
  MapPayload,
  MapPayloadResponse,
  PropertyPayload,
  ValuePayload,
} from "models/api.model";
import useHackApi from "./useHackApi";

export type AnswersResponse = {
  schemaKey: WizardStep;
  response: Partial<MapPayloadResponse>;
};

export type AnswersRequest = {
  schemaKey: WizardStep;
  payload: MapPayload | ValuePayload | PropertyPayload;
};

const useAnswers = () => {
  const { b64toBlob } = useFileReader();
  const { patchShapes, error } = useHackApi();
  const [responsePayload, setResponsePayload] = useState<AnswersResponse>();

  const response = useMemo(async () => {
    return responsePayload;
  }, [responsePayload]);

  const sendAnswer = useCallback(
    (
      schemaKey: WizardStep,
      payload: MapPayload | ValuePayload | PropertyPayload
    ): Promise<AnswersResponse | undefined> => {
      return new Promise((resolve, reject) => {
        switch (schemaKey) {
          case "map":
            blobStorage.blobs.put({
              id: FINALIZED_BLOB_ID,
              name: "finalizedBlob",
              asBase64: null,
              blob: null,
            });
            patchShapes(payload as MapPayload)
              .then(async (drawnImageResponse) => {
                if (drawnImageResponse) {
                  try {
                    const blob = await b64toBlob(
                      drawnImageResponse.drawn_shape
                    );
                    await blobStorage.blobs.put({
                      id: FINALIZED_BLOB_ID,
                      name: "finalizedBlob",
                      asBase64: drawnImageResponse.drawn_shape,
                      blob,
                    });
                    setResponsePayload({
                      schemaKey: schemaKey,
                      response: drawnImageResponse,
                    });
                    resolve({
                      schemaKey: schemaKey,
                      response: drawnImageResponse,
                    });
                  } catch (e: unknown) {
                    console.log(e);
                    setResponsePayload(undefined);
                    reject("cannot convert to Blob");
                  }
                } else {
                  setResponsePayload(undefined);
                  reject("no image response");
                }
              })
              .catch((e: unknown) => {
                setResponsePayload(undefined);
                reject(e);
              });
            break;

          default:
            resolve(undefined);
            break;
        }
      });
    },
    [patchShapes, b64toBlob]
  );
  return { sendAnswer, response, responsePayload, error };
};

export default useAnswers;
