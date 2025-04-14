"use client";
import type {
  ElementType,
  ImgHTMLAttributes,
  CSSProperties,
  ReactEventHandler,
  FC,
  ReactNode,
} from "react";

import { createContext, useContext, useEffect, useState } from "react";

export const useLocation = (): Location => {
  const [location, setLocation] = useState<Location | undefined>(undefined);
  useEffect(() => {
    setLocation(window.location);
  }, []);
  return (
    location ??
    ({
      search: "",
    } as Location)
  );
};
export class StaticQueryDocument {
  /** Prevents structural type widening. */
  #kind: "StaticQueryDocument";

  query: readonly string[];

  constructor(query: readonly string[]) {
    this.query = query;
  }

  /** Allows type-safe access to the static query hash for debugging purposes. */
  toString(): string {
    return this.query.join("\n");
  }
}

export const withPrefix = (path: string) => {
  return path;
};

export const graphql = (query: TemplateStringsArray): StaticQueryDocument => {
  return new StaticQueryDocument(query.raw);
};

export const useStaticQuery = (query: StaticQueryDocument) => {
  // TODO
  return {
    site: "foo",
    allAssociatedProduct: { nodes: [] },
    allDocset: { nodes: [] },
  };
};

export interface GatsbyImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "placeholder" | "onLoad" | "src" | "srcSet" | "width" | "height"
  > {
  alt: string;
  as?: ElementType;
  className?: string;
  class?: string;
  imgClassName?: string;
  image: IGatsbyImageData;
  imgStyle?: CSSProperties;
  backgroundColor?: string;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
  onLoad?: (props: { wasCached: boolean }) => void;
  onError?: ReactEventHandler<HTMLImageElement>;
  onStartLoad?: (props: { wasCached: boolean }) => void;
}
export type Layout = "fixed" | "fullWidth" | "constrained";

export interface IGatsbyImageData {
  layout: Layout;
  width: number;
  height: number;
  backgroundColor?: string;
  images: { sources: string[]; fallback: string[] };
  placeholder?: { sources: string[]; fallback: string[] };
}

export const GatsbyImage = (props: GatsbyImageProps) => {};

type ImageDataLike = unknown; // TODO

export const getImage = (
  node: ImageDataLike | null
): IGatsbyImageData | undefined => {
  console.warn("Unimplemented: gatsby-shim getImage()");
  return undefined;
};

export interface NavigateFn {
  (to: string, options?: NavigateOptions<{}>): Promise<void>;
  (to: number, options?: undefined): Promise<void>;
}

export interface NavigateOptions<TState> {
  state?: TState | undefined;
  replace?: boolean | undefined;
}

export const navigate: NavigateFn = async () => {
  // TODO
  console.warn("Unimplemented: gatsby-shim navigate()");
};
