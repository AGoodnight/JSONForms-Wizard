import { useCallback, useState } from "react";
import useTokens from "./useTokens";

const useApi = () => {
  const { accessKey, signature } = useTokens();
  const [error, setError] = useState<Error>();
  const [responseAsJson, setResponseAsJson] = useState<JSON | null>();
  const [isFetching, setIsFetching] = useState(false);

  const execute = useCallback(
    (
      endpoint: string,
      methodType: string,
      formDataObj?: Record<string, unknown>
    ) => {
      return new Promise<[JSON | undefined, Response]>(
        async (resolve, reject) => {
          setIsFetching(true);
          const formData = new FormData();
          const storedAuthToken = accessKey() && signature();
          const requestConfig: Record<string, unknown> = {
            method: methodType,
            mode: "cors",
          };

          if (formDataObj) {
            Object.keys(formDataObj).forEach((key: string) => {
              formData.append(key, String(formDataObj[key]));
            });
            requestConfig.body = formData;
          }
          const request = new Request(endpoint, requestConfig);
          request.headers.append("accept", "application/json");
          request.headers.append("content-type", "multipart/form-data");
          if (storedAuthToken) {
            request.headers.append(
              "Authorization",
              "AWS " + signature() + ":" + accessKey()
            );
          }
          const response = await fetch(request);

          if (!response.ok) {
            setError(new Error(`${response.status} : ${response.statusText}`));
            reject(new Error(`${response.status} : ${response.statusText}`));
          } else {
            try {
              const json_response: JSON | undefined = response
                ? await response.json()
                : undefined;

              setResponseAsJson(json_response);
              resolve([json_response, response]);
            } catch (e: unknown) {
              setResponseAsJson(undefined);
              if (e instanceof Error) {
                setError(e);
              } else {
                setError(new Error(String(e)));
              }
              reject(e);
            }
          }
        }
      );
    },
    [accessKey, signature]
  );

  return { execute, error, responseAsJson, isFetching };
};

export default useApi;
