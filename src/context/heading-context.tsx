import React, { createContext, useContext } from 'react';

export type HeadingContextValue = {
  lastHeading: string;
  ignoreNextHeading: boolean;
};

const defaultVal = {
  lastHeading: '',
  ignoreNextHeading: false,
};

const HeadingContext = createContext(defaultVal);

/**
 * Context provider to help track of page headings until the consuming component.
 * Headings are pushed into a list, with the last being the nearest heading, upwards in the AST tree.
 * Designed to be called in the init, so each child node of sections
 * as consumers can access the section header.
 */

export type HeadingContextProviderProps = {
  children: React.ReactNode;
  heading?: string;
  ignoreNextHeading?: boolean;
};

const HeadingContextProvider = ({ children, heading, ignoreNextHeading }: HeadingContextProviderProps) => {
  const { lastHeading: prevHeading, ignoreNextHeading: skipHeading } = useHeadingContext();

  const newHeading = skipHeading || !heading ? prevHeading : heading;

  return (
    <HeadingContext.Provider value={{ lastHeading: newHeading, ignoreNextHeading: ignoreNextHeading ?? false }}>
      {children}
    </HeadingContext.Provider>
  );
};

const useHeadingContext = () => {
  return useContext(HeadingContext);
};

export { HeadingContextProvider, useHeadingContext };
