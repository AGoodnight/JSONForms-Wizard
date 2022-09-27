import { FeatureCollection } from "geojson";

export type MapBoxMapLocation = {
  latitude: number | null;
  longitude: number | null;
  zoom?: number | null;
};

export type MapBoxState = {
  mapId: string | null;
  cLat: number | null;
  cLong: number | null;
  cZoom: number | null;
  disabled: boolean;
  status: MapBoxStatus;
} & MapState;

export type MapState = {
  latitude: number | null;
  longitude: number | null;
  zoom: number | null;
  features: FeatureCollection | undefined;
};

export type MapBoxStatus = "syncingFeatures" | "ready" | "uninitialized";
