import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { ComposableNode } from '../../types/ast';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';

interface ComposableProps {
  nodeData: ComposableNode;
}

const containerStyle = css`
  > *:first-child {
    margin-top: ${theme.size.medium};
  }
`;

const Composable = ({ nodeData: { children }, ...rest }: ComposableProps) => {
  return (
    <div className={cx(containerStyle)}>
      {children.map((c, i) => (
        <ComponentFactory nodeData={c} key={i} {...rest} />
      ))}
    </div>
  );
};

export default Composable;
