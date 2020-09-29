import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Badge from '@leafygreen-ui/badge';
import Card from '@leafygreen-ui/card';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { theme } from '../theme/docsTheme';

// Bold path parameters (sections that appear between braces)
// Add zero-width spaces after forward slashes so that linebreak occurs after a slash, not within a word
const formatPath = str => {
  const betweenBraces = new RegExp(/(\{)[^}]+(\})/, 'g');
  return str.replace(/\//g, `/&#8203;`).replace(betweenBraces, match => `<strong>${match}</strong>`);
};

const methodBadgeMap = {
  GET: 'blue',
  POST: 'green',
  DELETE: 'red',
  PUT: 'yellow',
  PATCH: 'yellow',
};

// Identify the text node to display on the collapsed card
// If present, show the operation summary. If no summary, show description.
// Otherwise, show nothing.
const splitChildren = children => {
  if (children.length === 0) {
    return [null, children];
  }

  // Check for a summary
  const firstChild = children[0];
  if (firstChild.type === 'paragraph') {
    return [firstChild, children.slice(1)];
  }

  // If no summary exists, check for a description field
  if (getNestedValue(['children', 0, 'id'], firstChild) === 'description') {
    const description = getNestedValue(['children', 1], firstChild);
    return [description, children.slice(1)];
  }
  return [null, children];
};

const OperationHeader = styled('div')`
  align-items: baseline;
  background-color: ${uiColors.gray.light3};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.size.default} ${theme.size.large};

  & > *:not(:last-child) {
    margin-right: ${theme.size.default};
  }

  @media ${theme.screenSize.upToSmall} {
    padding: ${theme.size.default};
  }
`;

const Path = styled('code')`
  color: ${uiColors.black};

  @media ${theme.screenSize.upToSmall} {
    word-break: break-all;
  }
`;

const bodyMargins = ({ theme }) => css`
  margin: ${theme.size.medium} ${theme.size.large};

  @media ${theme.screenSize.upToSmall} {
    margin: ${theme.size.default};
  }
`;

// Truncate text after two lines when the card is collapsed
const clampText = ({ showDetails }) => css`
  ${!showDetails &&
    `
      & > p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `}
`;

const Operation = ({
  nodeData: {
    children,
    options: { hash, method, path },
  },
  ...rest
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [description, details] = splitChildren(children);
  method = method.toUpperCase();
  return (
    <Card
      id={hash}
      css={css`
        margin-bottom: ${theme.size.default};
      `}
    >
      <OperationHeader>
        <Badge variant={methodBadgeMap[method]}>{method}</Badge>
        <Path dangerouslySetInnerHTML={{ __html: formatPath(path) }} />
        <IconButton
          aria-label={`${showDetails ? 'Hide' : 'Show'} operation details`}
          onClick={() => setShowDetails(!showDetails)}
          css={css`
            margin-left: auto;
            /* Move up to improve alignment with text baseline */
            top: -6px;
          `}
        >
          <Icon glyph={showDetails ? 'ChevronUp' : 'ChevronDown'} />
        </IconButton>
      </OperationHeader>
      {description && (
        <div
          css={css`
            ${bodyMargins({ theme })};
            ${clampText({ showDetails })};
          `}
        >
          <ComponentFactory {...rest} nodeData={description} />
        </div>
      )}
      {showDetails && (
        <div
          css={css`
            ${bodyMargins({ theme })};
            & > section {
              margin-bottom: ${theme.size.large};
            }
          `}
        >
          {details.map((child, index) => (
            <ComponentFactory {...rest} key={index} nodeData={child} sectionDepth={2} />
          ))}
        </div>
      )}
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
