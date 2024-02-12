import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { PresetTransformations, presetTransformations } from "./constants/transformProperties";

export const uploadRequestSchema = z.object({
  imageURL: z.string(),
});

export type UploadRequest = z.infer<typeof uploadRequestSchema>;
export const zUploadRequestValidator = zValidator("json", uploadRequestSchema);
