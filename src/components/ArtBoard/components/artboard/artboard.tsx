import React, { Ref, useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Line, Circle } from "react-konva";
import { useShapesContext } from "../../shapes.context";
import { Point, Shape, Position } from "../../shapes.models";
import mapboxgl from "mapbox-gl";
import useShapes from "../../hooks/useShapes";
import { KonvaEventObject } from "konva/lib/Node";
import {
  DEFINED_ACTIVE_DRAWING_CONFIG,
  DRAWN_BLOB_ID,
} from "../../shapes.constants";

import { RectSize } from "components/ArtBoard/artboard.models";

import blobStorage from "blobStorage";
import useFileReader from "hooks/useFileReader";
import useCursorPosition from "hooks/useCursorPosition";
import { PaintConfiguration } from "components/ToolBar/toolbar.models";
import { useToolBarContext } from "components/ToolBar/toolbar.context";
import { ToolBarTool } from "components/ToolBar/toolbar.models";
import { useArtBoardContext } from "components/ArtBoard/artboard.context";
import { ARTBOARD_INITIAL_CONTEXT } from "components/ArtBoard/artboard.constants";

const token =
  "pk.eyJ1IjoiY2hhb2ZvYW0iLCJhIjoiY2o4bzV3emE2MWZtMDJxbXYzOTN0ejM3cyJ9.T2U6fyP96f5MrDs6TFkYJw";
mapboxgl.accessToken = token;

type ArtBoardProps = {
  isFinalized: boolean;
  disabled?: boolean | null | undefined;
};

const ArtBoard: React.FC<ArtBoardProps> = ({
  isFinalized,
  disabled,
  ...props
}) => {
  const setDblClickMaybe = useRef<boolean>(false);
  const { state: shapesState, dispatch: dispatchOnShapes } = useShapesContext();
  const { state: artBoardState, dispatch: dispatchOnArtBoard } =
    useArtBoardContext();
  const { state: toolBarState } = useToolBarContext();
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [shapesOnArtboard, setShapesOnArtboard] = useState<Shape[]>([]);
  const [pointMarkers, setPointMarkers] = useState<Point[]>([]);
  const [cursorHasEntered, setCursorHasEntered] = useState<boolean>(false);
  const [, setCursorDownAt] = useState<Position | null>({} as Position);
  const [stageClassList, setStageClassList] =
    useState<string>("ec-artboard-stage");
  const stageRef: Ref<Konva.Stage> = React.useRef(null);
  const [artBoardDimensions] = useState<RectSize>(
    artBoardState?.canvasSize ?? ARTBOARD_INITIAL_CONTEXT.canvasSize
  );
  const { toBase64 } = useFileReader();

  const {
    addToFreehandShape,
    createNewCurrentShape,
    beginEraseFromShapes,
    eraseFromShapes,
    drawLineTo,
    createDrawnLine,
  } = useShapes();
  const { getStagePosition } = useCursorPosition();

  // Artboard prep
  // -------------------
  const drawShapesFromStorage = useCallback(() => {
    setShapesOnArtboard(shapesState.shapes);
  }, [shapesState.shapes]);

  // Start Drawing or Erasing
  // -----------------------------
  const startNewPolygon = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setCurrentShape(
      createNewCurrentShape(cursorPosition, toolBarState.tool.paint)
    );
  };

  const startNewFreehand = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setCurrentShape(
      createNewCurrentShape(cursorPosition, toolBarState.tool.paint)
    );
  };

  const startNewPaintBrush = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setCurrentShape(
      createNewCurrentShape(cursorPosition, toolBarState.tool.paint)
    );
  };

  const startEraseShapes = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    if (!shapesOnArtboard) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setShapesOnArtboard(
      beginEraseFromShapes(
        cursorPosition,
        toolBarState.tool.paint,
        shapesOnArtboard
      )
    );
  };

  // Continue the drawn shape or eraser
  // ----------------------------------------
  const drawFreehandShape = (cursorPosition: Position) => {
    if (!currentShape) {
      return;
    }
    setCurrentShape(addToFreehandShape(cursorPosition, currentShape));
  };

  const eraseShapes = (cursorPosition: Position) => {
    setShapesOnArtboard(eraseFromShapes(cursorPosition, shapesOnArtboard));
  };

  const drawPolygonSide = (cursorPosition: Position) => {
    if (!currentShape) {
      return;
    }
    setCurrentShape(
      createDrawnLine(cursorPosition, shapesOnArtboard, currentShape)
    );
  };

  // End the drawn shape or eraser
  // -------------------------------
  const endShape = (canceling: boolean = false) => {
    if (!canceling && currentShape) {
      dispatchOnArtBoard({
        type: "endDrawing",
      });
      dispatchOnShapes({
        type: "endCurrentShape",
        value: currentShape as Shape,
      });
    }
    setCurrentShape(null);
  };

  const endEraseShape = (canceling: boolean = false) => {
    if (!canceling) {
      dispatchOnArtBoard({
        type: "endDrawing",
      });
      dispatchOnShapes({
        type: "endRemoveFromShapes",
        value: shapesOnArtboard,
      });
    }
  };

  // UI extras
  // ---------------
  const drawPointMarker = (cursorPosition: Position) => {
    let cPointMarkers = [...pointMarkers];
    cPointMarkers.push([cursorPosition.x, cursorPosition.y]);
    setPointMarkers(cPointMarkers);
  };

  const renderLineGuide = (cursorPosition: Position) => {
    if (!currentShape) {
      return;
    }
    setCurrentShape(drawLineTo(cursorPosition, currentShape));
  };

  // Mouse Events
  // ------------------
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const cursorPosition = getStagePosition(e);
    setCursorDownAt(cursorPosition);
    if (!cursorPosition || artBoardState.disabled) {
      return;
    }
    switch (toolBarState.tool.key as ToolBarTool) {
      case "eraser":
        if (artBoardState.drawing) {
          return;
        }
        startEraseShapes(cursorPosition);
        break;
      case "freehand":
        if (artBoardState.drawing) {
          return;
        }
        startNewFreehand(cursorPosition);
        break;
      case "paintbrush":
        if (artBoardState.drawing) {
          return;
        }
        startNewPaintBrush(cursorPosition);
        break;
      case "polygon":
        if (!artBoardState.drawing) {
          startNewPolygon(cursorPosition);
          drawPointMarker(cursorPosition);
        } else {
          if (setDblClickMaybe.current) {
            setPointMarkers([]);
            endShape();
          } else {
            drawPointMarker(cursorPosition);
            drawPolygonSide(cursorPosition);
            setDblClickMaybe.current = true;
            setTimeout(() => {
              setDblClickMaybe.current = false;
            }, 300);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const cursorPosition = getStagePosition(e);
    if (!cursorPosition) {
      return;
    }
    if (!artBoardState.drawing) {
      return;
    }
    switch (toolBarState.tool.key as ToolBarTool) {
      case "eraser":
        eraseShapes(cursorPosition);
        break;
      case "freehand":
        drawFreehandShape(cursorPosition);
        break;
      case "paintbrush":
        drawFreehandShape(cursorPosition);
        break;
      case "polygon":
        renderLineGuide(cursorPosition);
        break;
      default:
        break;
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (!artBoardState.drawing) {
      return;
    }
    setCursorDownAt(null);
    switch (toolBarState.tool.key as ToolBarTool) {
      case "eraser":
        endEraseShape();
        break;
      case "freehand":
        endShape();
        break;
      case "paintbrush":
        endShape();
        break;
      case "polygon":
        break;
    }
  };

  // Data
  // ------------
  const getActiveDrawingConfiguration = (): PaintConfiguration => {
    switch (toolBarState.tool.key) {
      case "paintbrush":
        return {
          strokeColor: "#" + toolBarState.tool.paint?.strokeColor,
          fillColor: "#" + toolBarState.tool.paint?.fillColor,
          strokeWidth: toolBarState.tool.paint?.strokeWidth,
          tension: toolBarState.tool.paint?.tension,
          closed: toolBarState.tool.paint?.closed,
        } as PaintConfiguration;
      default:
        return DEFINED_ACTIVE_DRAWING_CONFIG;
    }
  };

  const produceImages = useCallback(() => {
    stageRef.current?.toCanvas().toBlob(async (blob) => {
      if (blob) {
        await blobStorage.blobs.put({
          id: DRAWN_BLOB_ID,
          name: "drawnImage",
          asBase64: blob ? await toBase64(blob) : null,
          blob,
        });
        console.log(">> Drawn Image Saved to IndexDB");
      }
    }, "image/jpg");
  }, [toBase64]);

  // Lifecycle Events
  // -----------------------
  useEffect(() => {
    if (stageRef.current) {
      dispatchOnArtBoard({
        type: "stageRendered",
        value: stageRef.current,
      });
    }
  }, [stageRef, dispatchOnArtBoard]);

  useEffect(() => {
    // Use the last x and y of the mouse from the mousemove event
    // instead of konva to get more accurate final pixel at edges of artboard
    if (stageRef.current) {
      const fromLeft = artBoardState.cursorLeftBoundsLTRB[0];
      const fromTop = artBoardState.cursorLeftBoundsLTRB[1];
      const fromRight = artBoardState.cursorLeftBoundsLTRB[2];
      const fromBottom = artBoardState.cursorLeftBoundsLTRB[3];

      const exit = artBoardState.cursorLeftArtBoardAt;
      const enter = artBoardState.cursorEnteredArtBoardAt;

      if (!currentShape) {
        return;
      }

      const _method = currentShape
        ? currentShape.tool === "freehand"
          ? addToFreehandShape
          : () => {}
        : () => {};

      if (fromLeft || fromTop || fromRight || fromBottom) {
        _method(
          {
            x:
              exit[0] - stageRef.current?.container().getBoundingClientRect().x,
            y:
              exit[1] - stageRef.current?.container().getBoundingClientRect().y,
          },
          currentShape
        );
        setCursorHasEntered(false);
      } else {
        if (!cursorHasEntered) {
          _method(
            {
              x:
                enter[0] -
                stageRef.current?.container().getBoundingClientRect().x,
              y:
                enter[1] -
                stageRef.current?.container().getBoundingClientRect().y,
            },
            currentShape
          );
          setCursorHasEntered(true);
        }
      }
    }
  }, [
    artBoardState.cursorWithinArtboard,
    artBoardState.cursorEnteredArtBoardAt,
    artBoardState.cursorLeftArtBoardAt,
    artBoardState.cursorLeftBoundsLTRB,
    addToFreehandShape,
    currentShape,
    cursorHasEntered,
  ]);

  useEffect(() => {
    if (!artBoardState.drawing) {
      drawShapesFromStorage();
    }
  }, [artBoardState.drawing, drawShapesFromStorage, dispatchOnArtBoard]);

  useEffect(() => {
    artBoardState.disabled
      ? setStageClassList("ec-artboard-stage disabled")
      : setStageClassList("ec-artboard-stage");
  }, [artBoardState.disabled]);

  useEffect(() => {
    if (!artBoardState.drawing) {
      produceImages();
    }
  }, [artBoardState.drawing, shapesOnArtboard, produceImages]);

  // JSX Markup
  // ---------------
  return (
    <div className={stageClassList}>
      <Stage
        width={artBoardDimensions.width}
        height={artBoardDimensions.height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapesOnArtboard.map((shape, i) => (
            <Line
              key={i}
              points={[...shape.pointsAsFlatArray]}
              lineCap="round"
              fill={shape.fill}
              stroke={shape.fill}
              strokeWidth={shape.strokeWidth}
              closed={shape.closed}
              tension={shape.tension ?? 0}
              globalCompositeOperation={
                shape.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
          {currentShape && (
            <Line
              key={"cs_1"}
              points={currentShape.pointsAsFlatArray}
              stroke={getActiveDrawingConfiguration().strokeColor}
              tension={currentShape.tension ?? 0}
              strokeWidth={getActiveDrawingConfiguration().strokeWidth}
              lineCap="round"
            />
          )}
          {pointMarkers.length > 0 &&
            pointMarkers.map((marker, i) => (
              <Circle
                width={10}
                height={10}
                fill="#ffffff"
                stroke="111111"
                strokeWidth={1}
                x={marker[0]}
                y={marker[1]}
                key={"marker" + i}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
};
export default ArtBoard;
