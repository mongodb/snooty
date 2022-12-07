import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useLocation } from '@reach/router';
import Badge from '@leafygreen-ui/badge';
import Card from '@leafygreen-ui/card';
import { css as LeafygreenCss, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';
import CopyButton from './CopyButton';
import { getNestedValue } from '../utils/get-nested-value';
import { theme } from '../theme/docsTheme';

// Bold path parameters (sections that appear between braces)
// Add zero-width spaces after forward slashes so that linebreak occurs after a slash, not within a word
const formatPath = (str) => {
  const betweenBraces = new RegExp(/(\{)[^}]+(\})/, 'g');
  return str.replace(/\//g, `/&#8203;`).replace(betweenBraces, (match) => `<strong>${match}</strong>`);
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
const splitChildren = (children) => {
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

// Move up to improve alignment with text baseline
const iconAdjust = css`
  top: -5px;
`;

const cardStyling = LeafygreenCss`
  padding: 0;
  margin-bottom: ${theme.size.default};
  overflow: hidden;
`;

const OperationHeader = styled('div')`
  align-items: baseline;
  background-color: ${palette.gray.light3};
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
  color: ${palette.black};

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

const Description = styled('div')`
  ${bodyMargins({ theme })};
  ${({ showDetails }) => clampText({ showDetails })};
`;

const Details = styled('div')`
  ${bodyMargins({ theme })};
  & > section {
    margin-bottom: ${theme.size.large};
  }
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
  const { hash: windowHash } = useLocation();

  useEffect(() => {
    if (windowHash && hash === decodeURI(windowHash).slice(1)) {
      setShowDetails(true);
    }
  }, [hash, windowHash]);

  const toggleDrawer = useCallback(() => {
    window.history.pushState({ href: hash }, '', `#${encodeURI(hash)}`);
    setShowDetails(!showDetails);
  }, [hash, setShowDetails, showDetails]);

  return (
    <Card className={cx(cardStyling)} id={hash}>
      <OperationHeader>
        <Badge variant={methodBadgeMap[method]}>{method}</Badge>
        <div>
          <Path dangerouslySetInnerHTML={{ __html: formatPath(path) }} />
          <span
            css={css`
              ${iconAdjust};
              margin-left: ${theme.size.tiny};
              position: relative;
            `}
          >
            <CopyButton contents={path} />
          </span>
        </div>
        <IconButton
          aria-label={`${showDetails ? 'Hide' : 'Show'} operation details`}
          onClick={toggleDrawer}
          css={css`
            ${iconAdjust};
            margin-left: auto;
          `}
        >
          <Icon glyph={showDetails ? 'ChevronUp' : 'ChevronDown'} />
        </IconButton>
      </OperationHeader>
      {description && (
        <Description showDetails={showDetails}>
          <ComponentFactory {...rest} nodeData={description} />
        </Description>
      )}
      {showDetails && (
        <Details>
          {details.map((child, index) => (
            <ComponentFactory {...rest} key={index} nodeData={child} sectionDepth={2} />
          ))}
        </Details>
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
