import { FeatureCollection } from "geojson";

export type MapBoxMapLocation = {
  latitude: number | null;
  longitude: number | null;
  zoom?: number;
};

export type MapBoxState = {
  mapId: string | null;
  cLat: number | null;
  cLong: number | null;
  cZoom: number | null;
  disabled: boolean;
  status: MapBoxStatus;
  maps: Record<string, MapState>;
};

export type MapState = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  zoom: number;
  features: FeatureCollection | undefined;
};

export type MapBoxStatus = "syncingFeatures" | "ready" | "uninitialized";
