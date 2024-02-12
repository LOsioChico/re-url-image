import { Context } from "hono";
import { CloudinaryResponse } from "./types/responses";
import {
  TransformProperties,
  transformProperties,
  presetTransformations,
  PresetTransformations,
} from "./constants/transformProperties";

export const getTransformedCloudinaryURL = async (c: Context, cloudinaryURL: string) => {
  const body = await c.req.json();

  if (body.preset) {
    const preset = getPresetTransformation(body.preset);
    if (!preset) {
      const message = `Preset supplied is not valid. Please supply one of the following presets: ${Object.keys(
        presetTransformations,
      ).join(", ")}`;
      return c.json({ message }, 400);
    }

    const url = appendTransformationsToURL(cloudinaryURL, preset!);
    return url;
  }

  let transform = "";
  for (const key in transformProperties) {
    if (body[key]) transform = appendTransformations(transform, key, body[key]);
  }

  const url = appendTransformationsToURL(cloudinaryURL, transform);
  return url;
};

export const uploadImageToCloudinary = async (c: Context) => {
  const baseURL = await getBaseURL(c);
  const body = await c.req.json();
  const imageURL = body.imageURL;

  const response = await fetch(baseURL, {
    method: "POST",
    body: JSON.stringify({
      file: imageURL,
      api_key: c.env.CLOUDINARY_API_KEY,
      upload_preset: c.env.CLOUDINARY_UPLOAD_PRESET,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response.json()) as CloudinaryResponse;
  return data;
};

export const getBaseURL = async (c: Context) => {
  return `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_PROD_ENV}/image/upload`;
};

export const appendTransformations = (transform: string, key: string, value: string) => {
  return `${transform}${transformProperties[key as TransformProperties]}_${value},`;
};

export const appendTransformationsToURL = (url: string, transform: string) => {
  return url.replace("/upload", `/upload/${transform}`);
};

export const getPresetTransformation = (preset: string) => {
  const transformation = presetTransformations[preset as PresetTransformations];
  if (!transformation) return;
  return transformation;
};
