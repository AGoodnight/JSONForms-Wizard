import { Point } from "components/ArtBoard/shapes.models";
import { ToolBarTool } from "components/ToolBar/toolbar.models";

export type APIShape = {
  tool: ToolBarTool;
  points: Point[];
  strokeWidth?: number;
  fill?: string;
  tension?: number;
  closed?: boolean;
};

export type StepGetParams = {
  id: string;
  areaType: string;
};

export type ValuePayload = string | number | boolean;
export type MapPayload = {
  latitude: number;
  longitude: number;
  zoom: number;
  satellite_image: string;
  //(base64 encoded byte string of mapbox image, divisible by 500x500)
  drawn_shape: string;
  //(base64 encoded byte string of user drawn shape, same size as satellite_image)
};
export type MapPayloadResponse = {
  id: string;
  drawn_shape: string;
};
export type PropertyPayload = string;

export type WizardPayload = PropertyPayload | MapPayload | ValuePayload;

export type ArtBoardPayload = {
  id: null | undefined | string;
  areaType: string; // is it a tree, house, driveway?
  shapes: APIShape[]; // all points associated with the image, closed shapes
  latitude: number;
  longitude: number;
  zoom: number;
};

export type ArtBoardShapesResponse = {
  shapes: APIShape[];
  blob64: string;
};

export type StepBaseResponse = {
  id: string;
  longitude: string;
  latitude: string;
  zoom: string;
  mapImage: Blob;
};

export type LoadedSessionResponse = {
  id: string;
  longitude: string;
  latitude: string;
  zoom: string;
  areaTypes: ["water", "turf "];
};

export type StepResponse = StepBaseResponse &
  Partial<Record<string, ArtBoardShapesResponse>>;

export type StepPatchPayload = {
  id: null | undefined | string;
  drawnImage: Blob | null | undefined; // Image drawn by user on top of map image
  areaType: string; // is it a tree, house, driveway?
  shapes: APIShape[]; // all points associated with the image, closed shapes
};

export type SessionPayload = {
  mapImage: Blob | null | undefined;
  latitude: number;
  longitude: number;
  zoom: number;
};

export type SessionResponse = {
  id: string;
};

// export type FinalImageParams = {
//   id: string;
// };

// export type FinalImageResponse = {
//   finalImage: Blob;
// };
