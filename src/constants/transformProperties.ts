export const transformProperties = {
  height: "h",
  width: "w",
};

export type TransformProperties = keyof typeof transformProperties;

export const presetTransformations = {
  banner: "c_fill,w_1152,h_208",
  logo: "c_scale,w_128,h_128",
  "dish-image": "c_scale,w_150,h_150",
};

export type PresetTransformations = keyof typeof presetTransformations;
