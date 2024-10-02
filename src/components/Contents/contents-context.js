import React, { useState } from 'react';
import useActiveHeading from '../../hooks/useActiveHeading';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const defaultContextValue = {
  activeHeadingId: null,
  headingNodes: [],
  showContentsComponent: true,
  activeSelectorIds: [],
  setActiveSelectorIds: () => {},
};

const ContentsContext = React.createContext(defaultContextValue);

// export const addSelfToContext = (name, id, context) => {
//   // want to add self to children
//   // if nothing
//   //console.log(Object.keys(context));
//   if (!context) return;
//   if (Object.keys(context).length === 0) {
//     context[name] = id;
//     return context;
//   }
//   if (context[name]) {
//     context[name] = id;
//     context.children = {};
//   }
//   if (!context.children) {
//     const children = {};
//     children[name] = id;
//     context.children = children;
//     return context;
//   } else {
//     context[name] = id;
//     context.children = addSelfToContext(name, id, context.children);
//     return context;
//   }
// };

const ContentsProvider = ({ children, headingNodes = [] }) => {
  const activeHeadingId = useActiveHeading(headingNodes);
  const [activeSelectorIds, setActiveSelectorIds] = useState({});

  // const x = { methodSelector: 'driver', children: { tab: 'cli' } };
  // console.log('x', x, "adding 'tab', 'uwu");
  // console.log('OBJECT KEYS', Object.keys(x));
  // const uwu = addSelfToContext('tab', 'uwu', x);
  // console.log('uwu', uwu);

  const { project } = useSnootyMetadata();
  // The guides site is the only site that takes advantage of headings, but never uses the Contents component
  const showContentsComponent = project !== 'guides';

  return (
    <ContentsContext.Provider
      value={{ activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds, setActiveSelectorIds }}
    >
      {children}
    </ContentsContext.Provider>
  );
};

export { ContentsContext, ContentsProvider };
