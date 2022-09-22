import { useCallback } from "react";
import { DRAWING_TOOLBAR } from "components/ToolBar/toolbar.constants";
import { APIShape, ShapesPayload } from "../shapes.models";
import { Point, Position, Shape } from "../shapes.models";
import { MapBoxState } from "components/MapBox/mapBox.models";
import { DrawingBarTool, ToolBarTool } from "components/ToolBar/toolbar.models";
import { PaintConfiguration } from "components/ToolBar/toolbar.models";
import { useToolBarContext } from "components/ToolBar/toolbar.context";
import {
  DEFINED_SHAPE_MEDIUM_TYPES,
  SHAPES_MEDIUM_KEY,
} from "../shapes.constants";

const useShapes = () => {
  const { state: toolBarState } = useToolBarContext();

  const shapePayloadsDiffer = useCallback(
    (source: Shape[] | APIShape[], comparable: Shape[] | APIShape[]) => {
      if (source.length !== comparable.length) {
        return true;
      }

      if (source.length === 0 || comparable.length === 0) {
        return false;
      }

      const allPointsAreTheSame = (
        sourceShape: Shape,
        comparedShape: Shape
      ) => {
        return sourceShape.points.every((spointSet, index) => {
          const result =
            spointSet[0] === comparedShape.points[index][0] &&
            spointSet[1] === comparedShape.points[index][1];
          return result;
        });
      };

      const shapesDiffer = () => {
        const result = source.map((sourceShape) => {
          return comparable.some((comparedShape) => {
            const result =
              sourceShape.tool === comparedShape.tool &&
              sourceShape.points.length === comparedShape.points.length;
            if (result) {
              return !allPointsAreTheSame(
                sourceShape as Shape,
                comparedShape as Shape
              );
            } else {
              return true;
            }
          });
        });
        if (result.length > 0) {
          return result.reduce((pv: boolean, cv: boolean) => {
            return pv && cv;
          });
        } else {
          return false;
        }
      };

      return shapesDiffer();
    },
    []
  );

  const mapAPIResponseToShapes = useCallback((savedStepData: ShapesPayload) => {
    const _shapes = (savedStepData.shapes as APIShape[]) || [];
    if (_shapes.length > 0) {
      let ApiShapesAsShapes: Shape[] = _shapes
        .filter((shape) => {
          const tool: DrawingBarTool = (shape.tool as DrawingBarTool) || null;
          const definedTool = DRAWING_TOOLBAR[tool] || {
            paint: null,
          };
          return definedTool.paint !== null;
        })
        .map((shape: APIShape): Shape => {
          const tool: DrawingBarTool =
            (shape.tool as DrawingBarTool) || ("eraser" as ToolBarTool);
          const definedTool = DRAWING_TOOLBAR[tool] || {
            paint: undefined,
          };
          const points: Point[] = shape.points || [];
          return {
            pointsAsFlatArray: points.flat(),
            points: points,
            tool: tool,
            fill: DEFINED_SHAPE_MEDIUM_TYPES[SHAPES_MEDIUM_KEY].color,
            strokeWidth: shape.strokeWidth
              ? shape.strokeWidth
              : definedTool.paint?.strokeWidth || 0,
            type: DEFINED_SHAPE_MEDIUM_TYPES[SHAPES_MEDIUM_KEY],
            tension: definedTool.paint?.tension || 0,
            closed: definedTool.paint?.closed || false,
          };
        });
      return ApiShapesAsShapes;
    } else {
      return [];
    }
  }, []);

  const createDrawnLine = useCallback(
    (
      cursorPosition: Position,
      lastShapes: Shape[],
      currentShape: Shape
    ): Shape => {
      let _currentPoints = currentShape.points;
      // prevent bad rendering

      let _currentPointsAsFlatArray = _currentPoints.flat();
      _currentPoints.push([cursorPosition.x, cursorPosition.y]);
      _currentPointsAsFlatArray.push(cursorPosition.x, cursorPosition.y);
      console.log(_currentPoints);
      return Object.assign({}, currentShape, {
        points: _currentPoints,
        pointsAsFlatArray: _currentPointsAsFlatArray,
      });
    },
    []
  );

  const createNewCurrentShape = useCallback(
    (cursorPosition: Position, paint: PaintConfiguration): Shape => {
      return {
        tool: toolBarState.tool.key as ToolBarTool,
        strokeWidth: paint.strokeWidth,
        closed: paint.closed,
        pointsAsFlatArray: [cursorPosition.x, cursorPosition.y],
        points: [[cursorPosition.x, cursorPosition.y]],
        tension: paint.tension || 0,
        fill: DEFINED_SHAPE_MEDIUM_TYPES[SHAPES_MEDIUM_KEY]?.color,
        type: DEFINED_SHAPE_MEDIUM_TYPES[SHAPES_MEDIUM_KEY],
      };
    },
    [toolBarState.tool]
  );

  const beginEraseFromShapes = useCallback(
    (
      cursorPosition: Position,
      paint: PaintConfiguration,
      lastShapes: Shape[]
    ): Shape[] => {
      return [
        ...lastShapes,
        {
          tool: toolBarState.tool.key as ToolBarTool,
          strokeWidth: paint.strokeWidth,
          closed: paint.closed,
          pointsAsFlatArray: [cursorPosition.x, cursorPosition.y],
          points: [[cursorPosition.x, cursorPosition.y]],
          tension: paint.tension || 0,
          fill: DEFINED_SHAPE_MEDIUM_TYPES[SHAPES_MEDIUM_KEY].color,
          type: DEFINED_SHAPE_MEDIUM_TYPES[SHAPES_MEDIUM_KEY],
        },
      ];
    },
    [toolBarState.tool]
  );

  const eraseFromShapes = useCallback(
    (cursorPosition: Position, lastShapes: Shape[]): Shape[] => {
      const _currentShapes = [...lastShapes];
      let _currentShape = lastShapes[lastShapes.length - 1];
      // prevent bad rendering
      try {
        if (
          Math.abs(
            cursorPosition.x -
              _currentShape.points[_currentShape.points.length - 1][0]
          ) > 1 ||
          Math.abs(
            cursorPosition.y -
              _currentShape.points[_currentShape.points.length - 1][1]
          ) > 1
        ) {
          let _currentFlattendPoints = _currentShape.pointsAsFlatArray
            ? _currentShape.pointsAsFlatArray
            : [];
          let _currentPoints = _currentShape.points ? _currentShape.points : [];
          _currentPoints.push([cursorPosition.x, cursorPosition.y]);
          _currentFlattendPoints.push(cursorPosition.x, cursorPosition.y);
          let _updatedShape = Object.assign({}, _currentShape, {
            pointsAsFlatArray: _currentFlattendPoints,
            points: _currentPoints,
          });
          _currentShapes.splice(_currentShapes.length - 1, 1, _updatedShape);
          return _currentShapes;
        } else {
          return lastShapes;
        }
      } catch (e) {
        console.log(e);
        return lastShapes;
      }
    },
    []
  );

  const addToFreehandShape = useCallback(
    (point: Position, currentShape: Shape): Shape => {
      let _currentPoints = currentShape.points ? currentShape.points : [];
      try {
        if (
          Math.abs(point.x - _currentPoints[_currentPoints.length - 1][0]) >
            1 ||
          Math.abs(point.y - _currentPoints[_currentPoints.length - 1][1]) > 1
        ) {
          let _currentFlattendPoints = currentShape.pointsAsFlatArray
            ? currentShape.pointsAsFlatArray
            : [];
          _currentPoints = _currentPoints.concat([[point.x, point.y]]);
          _currentFlattendPoints = _currentFlattendPoints.concat(
            point.x,
            point.y
          );

          return Object.assign({}, currentShape, {
            points: _currentPoints,
            pointsAsFlatArray: _currentFlattendPoints,
          });
        } else {
          return currentShape;
        }
      } catch (e) {
        console.log(e);
        return currentShape;
      }
    },
    []
  );

  const drawLineTo = useCallback(
    (cursorPosition: Position, currentShape: Shape): Shape => {
      try {
        let _currentPoints =
          currentShape.points.length > 1
            ? currentShape.points.slice(0, currentShape.points.length - 1)
            : currentShape.points;
        let _currentPointsAsFlatArray = _currentPoints.flat();
        _currentPoints.push([cursorPosition.x, cursorPosition.y]);
        _currentPointsAsFlatArray.push(cursorPosition.x, cursorPosition.y);
        return Object.assign({}, currentShape, {
          points: _currentPoints,
          pointsAsFlatArray: _currentPointsAsFlatArray,
        });
      } catch (e) {
        console.log(e);
        return currentShape;
      }
    },
    []
  );

  const transformShapesAlongMapChanges = useCallback(
    (shapes: Shape[], mapState: MapBoxState) => {
      return shapes.map((shape: Shape) => {
        return shape;
      });
    },
    []
  );

  return {
    createDrawnLine,
    drawLineTo,
    addToFreehandShape,
    eraseFromShapes,
    beginEraseFromShapes,
    createNewCurrentShape,
    shapePayloadsDiffer,
    mapAPIResponseToShapes,
    transformShapesAlongMapChanges,
  };
};

export default useShapes;
