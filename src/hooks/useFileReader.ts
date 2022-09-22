import { useCallback } from "react";

const useFileReader = () => {
  const toDataURL = useCallback((blob: Blob): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      try {
        const fr = new FileReader();
        fr.readAsDataURL(blob);
        fr.onloadend = () => {
          resolve(String(fr.result));
        };
        fr.onerror = (event: ProgressEvent<FileReader>) => {
          console.log(
            "Conversion of blob to DataURL failed: ",
            event.target?.error
          );
          reject(undefined);
        };
      } catch (e) {
        console.log(e);
        reject(undefined);
      }
    });
  }, []);

  const toBase64 = useCallback(
    (blob: Blob): Promise<string | undefined | undefined> => {
      return new Promise((resolve, reject) => {
        try {
          const fr = new FileReader();
          fr.readAsDataURL(blob);
          fr.onloadend = () => {
            resolve(String(fr.result).replace("data:", "").replace(/^.+,/, ""));
          };
          fr.onerror = (event: ProgressEvent<FileReader>) => {
            console.log(
              "Conversion of blob to base64 failed: ",
              event.target?.error
            );
            reject(undefined);
          };
        } catch (e) {
          console.log(e);
          reject(undefined);
        }
      });
    },
    []
  );

  const fromBase64toImage = useCallback(
    (
      base64: string,
      type: string = "png"
    ): Promise<HTMLImageElement | undefined> => {
      return new Promise((resolve, reject) => {
        try {
          let _image: HTMLImageElement = new Image();
          _image.onload = () => {
            resolve(_image);
          };
          _image.onerror = (e) => {
            console.log("processing image from base 64 resulted error", e);
            reject(undefined);
          };
          _image.src = "data:image/image/" + type + ";base64," + base64;
        } catch (e) {
          console.log(e);
          reject(undefined);
        }
      });
    },
    []
  );

  const b64toBlob = useCallback(
    (b64Data: string, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    []
  );

  const fromBase64 = useCallback(
    (
      base64: string,
      type: string = "png"
    ): Promise<Blob | undefined | null> => {
      return new Promise((resolve, reject) => {
        try {
          const byteCharacters =
            "data:image/image/" + type + ";base64," + atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "png" });
          resolve(blob);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    },
    []
  );

  const transformBlobToBase64 = useCallback(
    (base64: Blob): Promise<string | undefined | null> => {
      return new Promise(async (resolve, reject) => {
        try {
          const _image = await createImageBitmap(base64, {
            resizeWidth: 500,
            resizeHeight: 500,
          });
          const _canvas: HTMLCanvasElement = document.createElement("canvas");
          _canvas.width = _image.width;
          _canvas.height = _image.height;

          const ctx = _canvas.getContext("bitmaprenderer");

          ctx?.transferFromImageBitmap(_image);

          _canvas.toBlob(async (blob: Blob | null) => {
            if (blob) {
              const base64Result: string | undefined = await toBase64(blob);
              if (!base64) throw Error("Bad base64 encoding");
              resolve(base64Result);
            } else {
              throw Error("Bad Blob");
            }
          }, "image/png");
        } catch (e) {
          reject(e);
        }
      });
    },
    [toBase64]
  );

  return {
    toBase64,
    fromBase64toImage,
    fromBase64,
    b64toBlob,
    toDataURL,
    transformBlobToBase64,
  };
};

export default useFileReader;
