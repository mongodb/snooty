import { css, cx } from '@leafygreen-ui/emotion';
import React from 'react';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import TabSelectors from '../Tabs/TabSelectors';

const containerStyle = css`
  font-size: ${theme.fontSize.small};
  margin: ${theme.size.medium} 0 ${theme.size.large};

  * {
    font-size: ${theme.fontSize.small} !important;
  }
`;

const tabSelectorStyle = css`
  @media ${theme.screenSize.smallAndUp} {
    max-width: 400px;
  }
`;

const MethodDescription = ({ nodeData: { children } }) => {
  return (
    <div className={cx(containerStyle)}>
      {children.map((child, index) => {
        if (child.name === 'tabs-selector') {
          return <TabSelectors key={index} className={cx(tabSelectorStyle)} />;
        }

        return <ComponentFactory key={index} nodeData={child} />;
      })}
    </div>
  );
};

export default MethodDescription;