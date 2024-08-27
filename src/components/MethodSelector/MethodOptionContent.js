import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import MethodDescription from './MethodDescription';

const METHOD_DESCRIPTION_NAME = 'method-description';

const displayStyle = (isSelectedOption) => css`
  ${!isSelectedOption && 'display: none;'}
`;

export const getTestId = (optionId) => `method-option-content-${optionId}`;

const containerStyle = css`
  margin-top: ${theme.size.default};
`;

const MethodOptionContent = ({
  nodeData: {
    children,
    options: { id },
  },
  selectedMethod,
}) => {
  const isSelectedOption = id === selectedMethod;
  const methodDescription = children.find(({ name }) => name === METHOD_DESCRIPTION_NAME);

  return (
    <div className={cx(containerStyle, displayStyle(isSelectedOption))} data-testid={getTestId(id)}>
      {methodDescription && <MethodDescription nodeData={methodDescription} />}
      {children.map((node, index) => {
        if (node.name === METHOD_DESCRIPTION_NAME) return null;
        return <ComponentFactory key={index} sectionDepth={1} nodeData={node} />;
      })}
    </div>
  );
};

export default MethodOptionContent;
