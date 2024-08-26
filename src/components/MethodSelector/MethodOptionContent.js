import React from 'react';
import ComponentFactory from '../ComponentFactory';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { TabContext } from '../Tabs/tab-context';
import MethodDescription from './MethodDescription';

const METHOD_DESCRIPTION_NAME = 'method-description';

const displayStyle = (isSelectedOption) => css`
  ${!isSelectedOption && 'display: none;'}
`;

const containerStyle = css`
  margin-top: ${theme.size.medium};
`;

const MethodOptionContent = ({ nodeData: { children, options: { id } }, selectedMethod }) => {
  const isSelectedOption = id === selectedMethod;
  const methodDescription = children.find(({ name }) => name === METHOD_DESCRIPTION_NAME);

  return (
    <div className={cx(containerStyle, displayStyle(isSelectedOption))}>
      {methodDescription && <MethodDescription nodeData={methodDescription} />}
      {children.map((node, index) => {
        if (node.name === METHOD_DESCRIPTION_NAME) return null;
        return (<ComponentFactory key={index} nodeData={node} />);
      })}
    </div>
  );
};

export default MethodOptionContent;
