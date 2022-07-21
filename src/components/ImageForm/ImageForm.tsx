import { useMutation } from "@tanstack/react-query";
import { FormEventHandler } from "react";
import loadImage from "blueimp-load-image";
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "../../constants";
import { Folder } from "../../types";
import { addPhotoToFolder } from "../../storage";

export function ImageForm({ folder }: { folder: Folder }) {
  const mutation = useMutation(
    async ({
      imageFile,
      folder: destFolder,
    }: {
      imageFile: File;
      folder: Folder;
    }) => {
      const imageData = await loadImage(imageFile, {
        maxWidth: 400,
        maxHeight: 400,
        canvas: true,
      });

      let image = imageData.image as HTMLCanvasElement;

      let imageBase64 = image.toDataURL("image/png");
      let imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "");
      let data = {
        image_file_b64: imageBase64Data,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(data),
      });

      if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      }

      const result = await response.json();
      const base64Result = BASE64_IMAGE_HEADER + result.result_b64;

      await addPhotoToFolder(base64Result, destFolder.id);
    }
  );

  const onSubmit: FormEventHandler = async (evt) => {
    evt.preventDefault();

    const formElement = evt.target as HTMLFormElement;
    const formData = new FormData(formElement);
    mutation.mutate(
      {
        imageFile: formData.get("image") as File,
        folder,
      },
      {
        onSuccess() {
          formElement.reset();
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit}>
      {mutation.isError && (
        <p style={{ color: "red" }}>
          An error occured : {(mutation.error as Error)?.toString?.()}
        </p>
      )}
      <label>
        Add an image
        <input
          name="image"
          type="file"
          accept=".png, .jpg, .jpeg"
          required
          style={{ margin: "0 1rem" }}
        />
      </label>
      <button type="submit" disabled={mutation.isLoading}>
        Upload
      </button>
    </form>
  );
}
