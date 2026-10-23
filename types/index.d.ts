/** The catalog is framework-free. These types describe its data format. */
export type PresetCategory = "Buttons" | "Forms" | "Navigation" | "Feedback" | "Surfaces" | "Patterns" | "Custom";
export interface PresetComponent {
  id: string;
  title: string;
  description: string;
  html: string;
  category: PresetCategory | (string & {});
  css?: string;
  js?: string;
  symbol?: string;
  tags?: string[];
  kind?: "pattern";
}
export interface PresetCatalogManifest {
  name: string;
  version: string;
  description: string;
  components: PresetComponent[];
}
export interface PresetThemeTokens {
  accent: string;
  accentRgb: string;
  bloom: number;
  radius: number;
}
