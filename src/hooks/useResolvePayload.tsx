import { ControlElement, Layout } from "@jsonforms/core";
import { useCallback, useState } from "react";
import blobStorage, { BlobRow } from "blobStorage";
import { DRAWN_BLOB_ID } from "components/ArtBoard/shapes.constants";
import { MAP_BLOB_ID } from "components/MapBox/constants/mapBox.constants";
import useFileReader from "hooks/useFileReader";
import {
  WizardPropertyStepValue,
  WizardStepDefinition,
  WizardStepValue,
} from "components/Wizard/wizard.models";
import { ValuePayload, WizardPayload } from "models/api.model";

const useResolvePayload = () => {
  const { transformBlobToBase64 } = useFileReader();

  const [payload, setPayload] = useState<WizardPayload | undefined | null>();

  const createPayload = useCallback(
    async (config: {
      step: WizardStepDefinition | undefined;
      uiSchema: Layout & { elements: ControlElement[] };
      answers: WizardStepValue | undefined;
      sessionId?: string | null;
    }): Promise<WizardPayload | undefined | null> => {
      switch (config.step?.schemaKey) {
        case "map":
          const mapImage: BlobRow | undefined = await blobStorage.blobs.get(
            MAP_BLOB_ID
          );
          const finalizedImage: BlobRow | undefined =
            await blobStorage.blobs.get(DRAWN_BLOB_ID);

          if (finalizedImage?.blob && mapImage?.asBase64) {
            const finalizedImageBase64Scaled = await transformBlobToBase64(
              finalizedImage?.blob
            );

            const value: WizardStepValue | undefined =
              config.answers as WizardPropertyStepValue;

            const _payload = {
              latitude: value?.latitude,
              longitude: value?.longitude,
              zoom: value?.zoom,
              satellite_image: String(mapImage?.asBase64),
              drawn_shape: String(finalizedImageBase64Scaled),
            };

            setPayload(_payload);
            return _payload;
          } else {
            const _payload = (config.answers as ValuePayload) || undefined;
            setPayload(_payload);
            return _payload;
          }
        default:
          const _payload = (config.answers as ValuePayload) || undefined;
          setPayload(_payload);
          return _payload;
      }
    },
    [transformBlobToBase64]
  );

  return { createPayload, payload };
};

export default useResolvePayload;
