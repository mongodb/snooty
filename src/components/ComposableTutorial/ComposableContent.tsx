import React, { useContext } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { ComposableNode } from '../../types/ast';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import ComposableContext from './ComposableContext';
import { showComposable } from './ComposableTutorial';

interface ComposableProps {
  nodeData: ComposableNode;
}

const containerStyle = css`
  > *:first-child:not(script):not(style) {
    margin-top: ${theme.size.medium};
  }
`;

const ComposableContent = ({ nodeData: { children, selections }, ...rest }: ComposableProps) => {
  const { currentSelections } = useContext(ComposableContext);
  if (showComposable([selections], currentSelections) || isOfflineDocsBuild) {
    return (
      <div className={cx(containerStyle)} data-selections={isOfflineDocsBuild ? JSON.stringify(selections) : undefined}>
        {children.map((c, i) => (
          <ComponentFactory nodeData={c} key={i} {...rest} />
        ))}
      </div>
    );
  }
  return null;
};

export default ComposableContent;
