import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';

const displayStyle = (isSelectedOption) => css`
  ${!isSelectedOption && 'display: none;'}
`;

const containerStyle = css`
  margin-top: ${theme.size.medium};
`;

const MethodOptionContent = ({ nodeData: { children, options: { id } }, selectedMethod }) => {
  const isSelectedOption = id === selectedMethod;

  return (
    <div className={cx(containerStyle, displayStyle(isSelectedOption))}>
      {children.map((node, index) => {
        return (<ComponentFactory key={index} nodeData={node} />);
      })}
    </div>
  );
};

export default MethodOptionContent;
