import {
  selectCurrentCoordinates,
  selectFeatures,
  selectSavedCoordinates,
  selectStatus,
} from "components/MapBox/store/mapBox.selectors";
import { useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { GlobalAppState, AppDispatch } from "./app.store";
import { FeatureCollection } from "geojson";
import {
  MapBoxMapLocation,
  MapBoxStatus,
} from "components/MapBox/mapBox.models";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<GlobalAppState> = useSelector;

const useReduxStore = () => {
  const mapBoxState = useAppSelector((state: GlobalAppState) => {
    return state.mapBox;
  });

  const currentCoordinates: MapBoxMapLocation = useMemo(
    () => selectCurrentCoordinates(mapBoxState),
    [mapBoxState]
  );
  const savedCoordinates: MapBoxMapLocation | undefined = useMemo(
    () =>
      mapBoxState.mapId
        ? selectSavedCoordinates(mapBoxState, mapBoxState.mapId)
        : undefined,
    [mapBoxState]
  );
  const currentStatus: MapBoxStatus = useMemo(
    () => selectStatus(mapBoxState),
    [mapBoxState]
  );
  const currentFeatures: FeatureCollection | undefined = useMemo(
    () =>
      mapBoxState.mapId
        ? selectFeatures(mapBoxState, mapBoxState.mapId)
        : undefined,
    [mapBoxState]
  );

  return {
    mapBoxState,
    currentCoordinates,
    currentStatus,
    currentFeatures,
    savedCoordinates,
  };
};

export default useReduxStore;
