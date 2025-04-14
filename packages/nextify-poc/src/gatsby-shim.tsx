"use client";
import type {
  ElementType,
  ImgHTMLAttributes,
  CSSProperties,
  ReactEventHandler,
  FC,
  ReactNode,
} from "react";

import { createContext, useContext } from "react";

const LocationContext = createContext<Location | null>(null);

interface LocationProviderProps {
  location: Location;
  children: ReactNode;
}

export const LocationProvider: FC<LocationProviderProps> = ({
  location,
  children,
}) => (
  <LocationContext.Provider value={location}>
    {children}
  </LocationContext.Provider>
);

export const useLocation = (): Location => {
  const location = useContext(LocationContext);

  if (location == null) {
    throw new Error("useLocation must be used inside LocationProvider");
  }

  return location;
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
