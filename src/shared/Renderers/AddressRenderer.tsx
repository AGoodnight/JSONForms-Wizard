import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useCallback } from "react";
import useMapBox from "components/MapBox/hooks/useMapBox";
import { MapBoxMapLocation } from "components/MapBox/mapBox.models";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { AddressAutofill } from "@mapbox/search-js-react";
import ENV from "components/MapBox/mapBoxEnv";
import { useAppDispatch } from "store/app_store.hook";
import {
  setAddressCoordinates,
  setAllCoordinates,
} from "components/MapBox/store/mapBox.slice";

type TextFieldRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const TextFieldRenderer = (props: TextFieldRendererProps) => {
  const { locationsFromAddress } = useMapBox();
  // const { dispatch } = useMapBoxContext();
  const dispatch = useAppDispatch();

  // const useCustom = false;

  // const requiredField = props.rootSchema.required?.includes(props.path);

  // const handleSelectFromQueryList = useCallback(
  //   (ev: any) => {
  //     console.log(ev);
  //     const matchingLocation = locationQuery?.filter(
  //       (location: GeocodeFeature) => {
  //         return location.place_name === ev.target.dataset.placename;
  //       }
  //     )[0];
  //     console.log(matchingLocation);
  //     if (matchingLocation) {
  //       const _coordinatesAsLocation: MapBoxMapLocation = {
  //         latitude: matchingLocation.center[1],
  //         longitude: matchingLocation.center[0],
  //         zoom: 20,
  //       };
  //       dispatch({
  //         type: "setAllCoordinates",
  //         value: _coordinatesAsLocation,
  //       });
  //       setLocationQuery(undefined);
  //       props.handleChange(props.path, String(ev.target.dataset.placename));
  //     }
  //   },
  //   [locationQuery, props, dispatch]
  // );

  // const handleKeyUp = (ev: any) => {
  //   if (ev.key === "Enter") {
  //     if (!locationQuery) {
  //       runSearch(ev.target.value);
  //     } else {
  //       setLocationQuery(undefined);
  //     }
  //   }
  // };

  const reportValue = useCallback(
    (value: any) => {
      props.handleChange(props.path, String(value));
    },
    [props]
  );

  const runSearch = useCallback(
    async (query: string) => {
      // setPristine(false);
      const _locations: GeocodeFeature[] | undefined =
        await locationsFromAddress(query);
      if (_locations) {
        // setLocationQuery(_locations);
        const _coordinatesAsLocation: MapBoxMapLocation = {
          latitude: _locations[0].center[1],
          longitude: _locations[0].center[0],
          zoom: 20,
        };
        dispatch(setAddressCoordinates(_coordinatesAsLocation));
        dispatch(setAllCoordinates(_coordinatesAsLocation));
      } else {
        // setLocationQuery(undefined);
        dispatch(setAllCoordinates({} as MapBoxMapLocation));
      }
    },
    [locationsFromAddress, dispatch]
  );

  const handleChange = (ev: any) => {
    reportValue(ev.target.value);
    runSearch(ev.target.value);
  };

  // useEffect(() => {
  //   if (pristine) {
  //     return;
  //   }

  //   if (props.errors) {
  //     const propSchema = props.rootSchema.properties?.[
  //       props.path
  //     ] as JsonSchema7;
  //     setError([
  //       {
  //         severity: "danger",
  //         message: propSchema.errorMessage || props.errors,
  //         error: "default",
  //       },
  //     ]);
  //   } else if (requiredField && props.data.length < 1) {
  //     setError([
  //       {
  //         severity: "danger",
  //         message: "is a required property",
  //         error: "default",
  //       },
  //     ]);
  //   } else {
  //     setError(undefined);
  //   }
  // }, [
  //   props.path,
  //   props.errors,
  //   props.rootSchema,
  //   props.data,
  //   requiredField,
  //   pristine,
  // ]);

  return (
    <div className="uk-form-controls">
      <h3>{props.schema.title}</h3>
      <p>{props.schema.description}</p>
      <AddressAutofill accessToken={ENV.mapboxAPIToken}>
        <div className="uk-margin-top uk-inline">
          <label className="uk-form-label">{props.label}</label>
          <div className="uk-form-icon icon-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 512 512"
            >
              <path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z" />
            </svg>
          </div>
          <input
            className="uk-input"
            autoComplete="shipping address-line1"
            value={props.data}
            onChange={handleChange}
          />
        </div>
      </AddressAutofill>
      {/* </div> */}
      {/* {useCustom && (
        <UKTextField
          className="uk-menu-input"
          errors={error}
          required={requiredField}
          value={props.data}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
        />
      )}
      {useCustom && locationQuery && (
        <div className="uk-card uk-card-menu uk-card-default">
          <ul
            ref={queryMenu}
            tabIndex={0}
            className="uk-list uk-list-collapse uk-list-divider "
          >
            {locationQuery?.map((location: GeocodeFeature, index: number) => {
              return (
                <li tabIndex={-1} key={`address-${index}`}>
                  <UKButton
                    tabIndex={0}
                    variant="menu"
                    data-placename={location.place_name}
                    type="button"
                    onClick={handleSelectFromQueryList}
                  >
                    {location.place_name}
                  </UKButton>
                </li>
              );
            })}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default withJsonFormsControlProps(TextFieldRenderer);
