import React, { useState } from 'react';
import useActiveHeading from '../../hooks/useActiveHeading';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const defaultContextValue = {
  activeHeadingId: null,
  headingNodes: [],
  showContentsComponent: true,
  activeSelectorId: null,
  setActiveSelectorId: () => {},
};

const ContentsContext = React.createContext(defaultContextValue);

const ContentsProvider = ({ children, headingNodes = [] }) => {
  const activeHeadingId = useActiveHeading(headingNodes);
  const [activeSelectorId, setActiveSelectorId] = useState(null);

  const { project } = useSnootyMetadata();
  // The guides site is the only site that takes advantage of headings, but never uses the Contents component
  const showContentsComponent = project !== 'guides';

  return (
    <ContentsContext.Provider
      value={{ activeHeadingId, headingNodes, showContentsComponent, activeSelectorId, setActiveSelectorId }}
    >
      {children}
    </ContentsContext.Provider>
  );
};

export { ContentsContext, ContentsProvider };
