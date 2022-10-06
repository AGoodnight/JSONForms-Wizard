import {
  selectCurrentCoordinates,
  selectFeatures,
  selectSavedCoordinates,
  selectStatus,
} from "components/MapBox/store/mapBox.selectors";
import { useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { GlobalAppState, AppDispatch } from "store/app.store";
import { FeatureCollection } from "geojson";
import {
  MapBoxMapLocation,
  MapBoxStatus,
} from "components/MapBox/mapBox.models";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useMapBoxDispatch: () => AppDispatch = useDispatch;
export const useMapBoxSelector: TypedUseSelectorHook<GlobalAppState> =
  useSelector;

const useMapBoxStore = () => {
  const state = useMapBoxSelector((state: GlobalAppState) => {
    return state.mapBox;
  });

  const currentCoordinates: MapBoxMapLocation = useMemo(
    () => selectCurrentCoordinates(state),
    [state]
  );
  const savedCoordinates: MapBoxMapLocation | undefined = useMemo(
    () =>
      state.mapId ? selectSavedCoordinates(state, state.mapId) : undefined,
    [state]
  );
  const currentStatus: MapBoxStatus = useMemo(
    () => selectStatus(state),
    [state]
  );
  const currentFeatures: FeatureCollection | undefined = useMemo(
    () => (state.mapId ? selectFeatures(state, state.mapId) : undefined),
    [state]
  );

  return {
    state,
    currentCoordinates,
    currentStatus,
    currentFeatures,
    savedCoordinates,
  };
};

export default useMapBoxStore;
