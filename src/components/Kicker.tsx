import React from 'react';
import { css } from '@leafygreen-ui/emotion';
import { theme } from '../theme/docsTheme';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import Overline from './Internal/Overline';

const kickerBaseStyle = css`
  grid-column: 2;
  @media ${theme.screenSize.upToSmall} {
    padding-top: 56px;
  }
  @media ${theme.screenSize.upToXSmall} {
    padding-top: ${theme.size.large};
  }
`;

const Kicker = ({ nodeData: { argument }, ...rest }: { nodeData: Directive }) => {
  return (
    <Overline className={kickerBaseStyle}>
      {argument.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </Overline>
  );
};

export default Kicker;
