import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { OFFLINE_CONTENT_CLASSNAME } from '../../utils/head-scripts/offline-ui/method-selector';
import MethodDescription from './MethodDescription';

const METHOD_DESCRIPTION_NAME = 'method-description';

const displayStyle = (isSelectedOption) => css`
  ${!isSelectedOption && !isOfflineDocsBuild && 'display: none;'}
`;

export const getTestId = (optionId) => `method-option-content-${optionId}`;

const containerStyle = css`
  margin-top: ${theme.size.default};

  ${isOfflineDocsBuild &&
  `
    &[aria-expanded=false] {
      display: none;
    }
  `}
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
    <div
      aria-expanded={isSelectedOption}
      className={cx(
        containerStyle,
        displayStyle(isSelectedOption),
        isOfflineDocsBuild ? OFFLINE_CONTENT_CLASSNAME : ''
      )}
      data-testid={getTestId(id)}
    >
      {methodDescription && <MethodDescription nodeData={methodDescription} />}
      {children.map((node, index) => {
        if (node.name === METHOD_DESCRIPTION_NAME) return null;
        return <ComponentFactory key={index} sectionDepth={1} nodeData={node} />;
      })}
    </div>
  );
};

export default MethodOptionContent;
