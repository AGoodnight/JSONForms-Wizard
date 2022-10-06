import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useEffect, useMemo } from "react";
import MapInstance from "../components/mapBox";
import { MapBoxMapLocation } from "../mapBox.models";
import { DRAWN_BLOB_ID } from "components/ArtBoard/shapes.constants";
import { MapToolBar } from "components/ToolBar/mapToolBar";
import { useMapBoxSelector } from "components/MapBox/store/mapBox.hook";

type MapRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const MapRenderer = (props: MapRendererProps) => {
  const mapState = useMapBoxSelector((state) => {
    return state.mapBox;
  });

  const value: MapBoxMapLocation | undefined = useMemo(() => {
    if (!!mapState.cLat && !!mapState.cLong && !!mapState.cZoom) {
      return {
        latitude: mapState.cLat,
        longitude: mapState.cLong,
        zoom: mapState.cZoom,
      };
    } else {
      return undefined;
    }
  }, [mapState.cLat, mapState.cLong, mapState.cZoom]);

  useEffect(() => {
    props.handleChange(props.path, value);
  }, [value, props]);

  return (
    <>
      <h3>{props.schema.title}</h3>
      <p>{props.schema.description}</p>
      <div className="uk-flex">
        <MapToolBar />
        <MapInstance id="userMap" canInteract={true} />
      </div>
      <MapInstance
        id="mapClone"
        canInteract={false}
        tileStyle="blank"
        hidden={true}
        blobId={DRAWN_BLOB_ID}
        blobName="drawnBlob"
      />
    </>
  );
};

export default withJsonFormsControlProps(MapRenderer);
