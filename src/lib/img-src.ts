import type { StaticImageData } from "next/image";

export type ImageImport = string | StaticImageData;

/** Normalize Next static imports (object) or URL strings for native img src. */
export function imgSrc(src: ImageImport): string {
  return typeof src === "string" ? src : src.src;
}
