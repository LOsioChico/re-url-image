import { Hono } from "hono";
import { Bindings } from "hono/types";
import { getTransformedCloudinaryURL, uploadImageToCloudinary } from "./service";
import { zUploadRequestValidator } from "./validator";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/upload", zUploadRequestValidator, async (c) => {
  const { url } = await uploadImageToCloudinary(c);
  const response = await getTransformedCloudinaryURL(c, url);
  if (typeof response === "string") return c.json({ url: response });
  return response;
});

export default app;
