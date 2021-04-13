import React from 'react';
import useActiveHeading from '../hooks/useActiveHeading';

const defaultContextValue = {
  headingNodes: [],
  activeHeadingId: null,
};

const ContentsContext = React.createContext(defaultContextValue);

const ContentsProvider = ({ children, headingNodes = [] }) => {
  const activeHeadingId = useActiveHeading(headingNodes);

  return <ContentsContext.Provider value={{ headingNodes, activeHeadingId }}>{children}</ContentsContext.Provider>;
};

export { ContentsContext, ContentsProvider };
