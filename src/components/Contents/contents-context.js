import React from 'react';
import useActiveHeading from '../../hooks/useActiveHeading';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const defaultContextValue = {
  activeHeadingId: null,
  headingNodes: [],
  showContentsComponent: true,
};

const ContentsContext = React.createContext(defaultContextValue);

const ContentsProvider = ({ children, headingNodes = [] }) => {
  const activeHeadingId = useActiveHeading(headingNodes);
  const { project } = useSnootyMetadata();
  // The guides site is the only site that takes advantage of headings, but never uses the Contents component
  const showContentsComponent = project !== 'guides';

  return (
    <ContentsContext.Provider value={{ activeHeadingId, headingNodes, showContentsComponent }}>
      {children}
    </ContentsContext.Provider>
  );
};

export { ContentsContext, ContentsProvider };
