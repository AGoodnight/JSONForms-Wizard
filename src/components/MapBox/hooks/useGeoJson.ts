import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import { useCallback } from "react";

const useGeoJson = () => {
  const stripBadFeatures = useCallback(
    (collection: FeatureCollection): FeatureCollection | undefined => {
      return Array.isArray(collection?.features)
        ? ({
            type: "FeatureCollection",
            features: collection.features.filter((feature: any) => {
              // check for null geometry
              if (feature.geometry === null) return false;
              if (feature.geometry.coordinates === null) return false;
              if (feature.geometry.coordinates.some((coords: any) => !coords))
                return false;

              if (
                feature.geometry.coordinates.some((coords: any) => {
                  if (!Array.isArray(coords)) return true;
                  if (
                    coords.some(
                      (coord) => !Array.isArray(coord) || coords.length < 2
                    )
                  )
                    return true;
                })
              )
                return false;

              return true;
            }) as Array<Feature<Geometry, GeoJsonProperties>>,
          } as FeatureCollection)
        : undefined;
    },
    []
  );

  return {
    stripBadFeatures,
  };
};

export default useGeoJson;
