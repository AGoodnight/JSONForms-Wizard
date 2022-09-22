import mapboxGeocodingSdk, {
  GeocodeFeature,
} from "@mapbox/mapbox-sdk/services/geocoding";
import mapboxStaticSdk from "@mapbox/mapbox-sdk/services/static";
import { useCallback } from "react";
import ENV from "../mapBoxEnv";

const token = String(process.env.REACT_APP_MAPBOX_API_TOKEN);

const geocoding = mapboxGeocodingSdk({
  accessToken: token,
});

const staticMap = mapboxStaticSdk({
  accessToken: token,
});

const useMapBox = () => {
  const staticMapAsBlob = async (
    latitude: number | string,
    longitude: number | string,
    zoom: number | string
  ) => {
    const _lat = typeof latitude === "number" ? latitude : parseFloat(latitude);
    const _long =
      typeof longitude === "number" ? longitude : parseFloat(longitude);
    const _zoom = typeof zoom === "number" ? zoom : parseFloat(zoom);

    const response = await staticMap
      .getStaticImage({
        ownerId: "mapbox",
        width: 500,
        height: 500,
        position: {
          coordinates: [_long, _lat],
          zoom: _zoom,
        },
        styleId: "satellite-v9",
      })
      .url();

    if (response) {
      const blob = await (await fetch(response)).blob();
      return blob;
    } else {
      return undefined;
    }
  };

  const locationsFromAddress = useCallback(
    async (address: string): Promise<GeocodeFeature[] | undefined> => {
      console.log("coordinates", address, ENV.queryProximity);
      const response = await geocoding
        .forwardGeocode({
          query: address,
          limit: 10,
          countries: ["US"],
          bbox: [-90.418136, 41.696118, -82.413474, 48.2388],
          autocomplete: true,
        })
        .send();

      if (response.statusCode === 200) {
        if (
          !response ||
          !response.body ||
          !response.body.features ||
          !response.body.features.length
        ) {
          return undefined;
        }
        return response.body.features;
      } else {
        return undefined;
      }
    },
    []
  );

  const coordinatesFromAddress = async (
    address: string
  ): Promise<number[] | undefined> => {
    console.log("coordinates", address);
    const response = await geocoding
      .forwardGeocode({
        query: address,
        limit: 1,
        autocomplete: true,
      })
      .send();

    if (response.statusCode === 200) {
      if (
        !response ||
        !response.body ||
        !response.body.features ||
        !response.body.features.length
      ) {
        return undefined;
      }
      const feature = response.body.features[0];
      console.log(feature);
      return feature.center;
    } else {
      return undefined;
    }
  };

  return {
    staticMapAsBlob,
    locationsFromAddress,
    coordinatesFromAddress,
  };
};

export default useMapBox;
