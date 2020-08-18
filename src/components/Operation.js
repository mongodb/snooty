import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import Badge from '@leafygreen-ui/badge';
import Card from '@leafygreen-ui/card';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';

const boldPathParameters = str => {
  const betweenBraces = new RegExp(/(\{).+?(\})/, 'g');
  return str.replace(betweenBraces, match => `<strong>${match}</strong>`);
};

const methodBadgeMap = {
  GET: 'blue',
  POST: 'green',
  DELETE: 'red',
  PUT: 'yellow',
  PATCH: 'yellow',
};

const OperationHeader = styled('div')`
  align-items: center;
  background-color: ${uiColors.gray.light3};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.size.default} ${theme.size.large}`};

  & > *:not(:last-child) {
    margin-right: ${({ theme }) => `${theme.size.default}`};
  }
`;

const Path = styled('code')`
  overflow-wrap: break-word;
  word-break: break-all;
`;

const OperationBody = styled('div')`
  margin: ${({ theme }) => `${theme.size.medium} ${theme.size.large}`};
`;

const splitChildren = children => {
  if (children.length > 0 && children[0].type === 'paragraph') {
    return [children[0], children.slice(1)];
  }
  return [null, children];
};

// TODO: Properly handle operation summary
const Operation = ({
  nodeData: {
    children,
    options: { hash, method, path },
  },
  ...rest
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [description, details] = splitChildren(children);
  const { size } = useTheme();
  method = method.toUpperCase();
  return (
    <Card
      id={hash}
      css={css`
        margin-bottom: ${size.default};
      `}
    >
      <OperationHeader>
        <Badge variant={methodBadgeMap[method]}>{method}</Badge>
        <Path dangerouslySetInnerHTML={{ __html: boldPathParameters(path) }} />
        <IconButton
          onClick={() => setShowDetails(!showDetails)}
          css={css`
            margin-left: auto;
          `}
        >
          <Icon glyph={showDetails ? 'ChevronUp' : 'ChevronDown'} />
        </IconButton>
      </OperationHeader>
      <OperationBody>
        {description && <ComponentFactory {...rest} nodeData={description} />}

        {showDetails && (
          <>
            {details.map((child, index) => (
              <ComponentFactory {...rest} key={index} nodeData={child} />
            ))}
          </>
        )}
      </OperationBody>
    </Card>
  );
};

Operation.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array,
    options: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Operation;
