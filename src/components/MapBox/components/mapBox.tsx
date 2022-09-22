// @ts-ignore
import mapboxgl, { MapboxEvent } from "mapbox-gl";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MAP_BLOB_ID } from "../constants/mapBox.constants";
import useFileReader from "hooks/useFileReader";
import useMapBox from "../hooks/useMapBox";
import MapboxDraw, { DrawMode } from "@mapbox/mapbox-gl-draw";
import {
  MAP_BOX_DRAW_STYLES,
  MAP_BOX_DRAW_STYLES_BW,
} from "../constants/mapBox.constants";
import ENV from "../mapBoxEnv";
import useGeoJson from "../hooks/useGeoJson";
import { FeatureCollection } from "geojson";
import { IndexableType } from "dexie";
import {
  initialize,
  setCurrentMapCoordinates,
  updateFeatures,
} from "../store/mapBox.slice";
import { AppDispatch } from "store/app.store";
import {} from "../store/mapBox.selectors";

import blobStorage from "blobStorage";
import useReduxStore, { useAppDispatch } from "store/app_store.hook";
import useToolBar from "components/ToolBar/useToolBar";
import { MAP_TOOLBAR } from "components/ToolBar/toolbar.constants";
import { MapToolDefintions } from "components/ToolBar/toolbar.models";

type MapInstanceProps = {
  canInteract?: boolean;
  hasDraw?: boolean;
  onMapChange?: (map: mapboxgl.Map) => void;
  tileStyle?: "satellite-v9" | "blank";
  drawFeatures?: any; //interface Feature as a type
  id?: string;
  hidden?: boolean;
  blobId?: number;
  blobName?: string;
  blobFormat?: "image/jpeg" | "image/png";
};

const MapInstance: React.FC<MapInstanceProps> = ({
  onMapChange,
  hasDraw = true,
  canInteract,
  tileStyle = "satellite-v9",
  drawFeatures,
  id = "mapInstance",
  hidden = false,
  blobId = MAP_BLOB_ID,
  blobName = "mapImage",
  blobFormat = "image/jpeg",
  ...rest
}) => {
  const dispatchToStore: AppDispatch = useAppDispatch();
  const mapContainer = useRef<any>();
  const drawRef = useRef<MapboxDraw>();
  const map = useRef<mapboxgl.Map>();

  const { toBase64 } = useFileReader();
  const { staticMapAsBlob } = useMapBox();
  const { stripBadFeatures } = useGeoJson();
  const {
    setTool,
    enableTool,
    disableTool,
    currentTool,
    definedTools: tools,
  } = useToolBar(MAP_TOOLBAR);

  const definedTools = useMemo(() => {
    return tools as MapToolDefintions;
  }, [tools]);

  const {
    currentCoordinates,
    currentFeatures: featuresFromStore,
    currentStatus,
    savedCoordinates,
  } = useReduxStore();

  const currentFeatures: FeatureCollection | undefined = useMemo(
    () => (featuresFromStore ? stripBadFeatures(featuresFromStore) : undefined),
    [featuresFromStore, stripBadFeatures]
  );

  const containerClass: string = useMemo(
    () => `${hidden ? "ec-map-container hidden" : "ec-map-container "}`,
    [hidden]
  );

  const mapClass: string = useMemo(
    () =>
      `${hidden ? "hidden" : ""} ${canInteract ? "ec-map" : "ec-map disabled"}`,
    [canInteract, hidden]
  );

  const getImageFromCanvas = useCallback(async (): Promise<
    IndexableType | undefined
  > => {
    return new Promise((resolve) => {
      map.current?.getCanvas().toBlob(async (blob) => {
        if (blob) {
          const base64 = await toBase64(blob);
          const row = await blobStorage.blobs.put({
            id: blobId,
            name: blobName,
            asBase64: blob ? base64 : null,
            blob,
          });
          resolve(row);
        } else {
          resolve(undefined);
        }
      }, blobFormat);
    });
  }, [blobFormat, blobId, blobName, toBase64]);

  const getImageFromStaticMapAPI = useCallback(
    (latitude: number, longitude: number, zoom: number) => {
      staticMapAsBlob(latitude, longitude, zoom).then(
        async (blob: Blob | undefined) => {
          if (!blob) {
            return;
          }
          toBase64(blob).then((result: string | null | undefined) => {
            blobStorage.blobs.put({
              id: blobId,
              name: blobName,
              asBase64: result || null,
              blob,
            });
          });
        }
      );
    },
    [toBase64, blobId, blobName, staticMapAsBlob]
  );

  const getMapParamters = useCallback(
    (target: MapboxEvent) => {
      if (map.current) {
        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        dispatchToStore(
          setCurrentMapCoordinates({
            latitude: center.lat,
            longitude: center.lng,
            zoom: zoom,
          })
        );
        getImageFromStaticMapAPI(center.lat, center.lng, zoom);
      }
    },
    [dispatchToStore, getImageFromStaticMapAPI]
  );

  const handleMapDraw = useCallback(
    (data: any) => {
      dispatchToStore(updateFeatures(data));
    },
    [dispatchToStore]
  );

  const handleDrawCreate = useCallback(() => {
    handleMapDraw(drawRef?.current?.getAll());
  }, [handleMapDraw]);

  const handleDrawDelete = useCallback(() => {
    handleMapDraw(drawRef?.current?.getAll());
  }, [handleMapDraw]);

  const handleDrawUpdate = useCallback(() => {
    handleMapDraw(drawRef?.current?.getAll());
  }, [handleMapDraw]);

  const handleDrawRender = useCallback(() => {}, []);

  const handleSelectionChange = useCallback(
    (e: any) => {
      const _currentMode = drawRef.current?.getMode();
      switch (_currentMode) {
        case "simple_select":
          if (e.features.length === 1) {
            enableTool("edit");
          } else {
            disableTool("edit");
            setTool(definedTools.hand);
          }
          break;
        case "direct_select":
          setTool(definedTools.edit);
          break;
        default:
          disableTool("edit");
          break;
      }
      handleMapDraw(drawRef?.current?.getAll());
    },
    [enableTool, disableTool, setTool, handleMapDraw, definedTools]
  );

  const createMap = useCallback(
    (
      latitude: number,
      longitude: number,
      zoom: number,
      mode: DrawMode = "draw_polygon"
    ) => {
      map.current = new mapboxgl.Map({
        accessToken: ENV.mapboxAPIToken,
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [longitude, latitude],
        zoom: zoom,
        maxZoom: 20,
        minZoom: 14,
        preserveDrawingBuffer: true, // otherwise toBlob does not wor
      });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.

        styles:
          tileStyle === "blank" ? MAP_BOX_DRAW_STYLES_BW : MAP_BOX_DRAW_STYLES,
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
        defaultMode: mode,
      });

      map.current.addControl(draw);

      drawRef.current = draw;

      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disableRotation();

      if (canInteract) {
        map.current?.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
          }),
          "bottom-left"
        );
      }

      map.current.on("dragend", (e: MapboxEvent) => {
        getMapParamters(e);
      });
      map.current.on("zoomend", (e: MapboxEvent) => {
        getMapParamters(e);
      });

      if (tileStyle === "blank") {
        map.current.on("render", (e: MapboxEvent) => {
          if (map.current?.getLayer("satellite")) {
            map.current.removeLayer("satellite");
          }
          getImageFromCanvas();
        });
      } else {
        getImageFromStaticMapAPI(latitude, longitude, zoom);
      }
    },
    [
      getMapParamters,
      tileStyle,
      canInteract,
      getImageFromCanvas,
      getImageFromStaticMapAPI,
    ]
  );

  useEffect(() => {
    const updateBasedOnState = tileStyle === "blank";
    switch (updateBasedOnState) {
      case true:
        if (currentFeatures && drawRef.current) {
          drawRef.current.set(currentFeatures);
        }
        break;
      default:
        if (
          currentFeatures &&
          hasDraw &&
          drawRef.current &&
          currentStatus === "ready"
        ) {
          drawRef.current.set(currentFeatures);
        }
        break;
    }
  }, [currentFeatures, hasDraw, stripBadFeatures, tileStyle, currentStatus]);

  useEffect(() => {
    if (
      currentCoordinates.latitude &&
      currentCoordinates.longitude &&
      currentCoordinates.zoom
    ) {
      if (!map.current) {
        createMap(
          currentCoordinates.latitude,
          currentCoordinates.longitude,
          currentCoordinates.zoom
        );
        dispatchToStore(initialize());
      } else {
        map.current.setCenter([
          currentCoordinates.longitude,
          currentCoordinates.latitude,
        ]);
        map.current.setZoom(currentCoordinates.zoom);
        onMapChange?.(map.current);
      }
    }
  }, [currentCoordinates, createMap, onMapChange, dispatchToStore]);

  useEffect(() => {
    if (
      canInteract &&
      savedCoordinates?.latitude &&
      savedCoordinates?.longitude &&
      map.current
    ) {
      new mapboxgl.Marker({ color: "#a8c73f" })
        .setLngLat([savedCoordinates.longitude, savedCoordinates.latitude])
        .addTo(map.current);
    }
  }, [map, canInteract, savedCoordinates]);

  // ASSIGN HANDLERS TO MAPBOX GL DRAWING
  useEffect(() => {
    if (canInteract && map.current) {
      map.current.on("draw.delete", handleDrawDelete);
      map.current.on("draw.update", handleDrawUpdate);
      map.current.on("draw.selectionchange", handleSelectionChange);
      map.current.on("draw.render", handleDrawRender);
      map.current.on("draw.create", handleDrawCreate);
    }
  }, [
    handleDrawCreate,
    handleDrawDelete,
    handleDrawUpdate,
    handleSelectionChange,
    handleDrawRender,
    canInteract,
  ]);

  // TOOL STATE SIDE EFFECTS
  useEffect(() => {
    if (canInteract && currentTool.mode) {
      switch (currentTool.mode) {
        case "simple_select":
          drawRef.current?.changeMode("simple_select", {
            featureIds: [],
          });
          break;
        case "draw_polygon":
          drawRef.current?.changeMode("draw_polygon");
          break;
        case "trash":
          drawRef.current?.trash();
          break;
        case "direct_select":
          const _featureId = drawRef.current?.getSelectedIds()[0];
          if (_featureId) {
            drawRef.current?.changeMode("direct_select", {
              featureId: _featureId,
            });
          }
          break;
        default:
          break;
      }
    }
  }, [currentTool, disableTool, enableTool, canInteract]);

  return (
    <div className={containerClass}>
      <div id={id} ref={mapContainer} className={mapClass}></div>
    </div>
  );
};

export default MapInstance;
