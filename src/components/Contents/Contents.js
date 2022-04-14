import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { ContentsContext } from './contents-context';
import ContentsList from './ContentsList';
import ContentsListItem from './ContentsListItem';
import { theme } from '../../theme/docsTheme';
import { formatText } from '../../utils/format-text';

const StyledContents = styled('div')`
  @media ${theme.screenSize.largeAndUp} {
    display: ${(props) => (props.displayOnDesktopOnly ? '' : 'none')};
  }
`;

const formatTextOptions = {
  literalEnableInline: true,
};

const Contents = ({ displayOnDesktopOnly }) => {
  const { activeHeadingId, headingNodes, showContentsComponent } = useContext(ContentsContext);

  if (headingNodes.length === 0 || !showContentsComponent) {
    return null;
  }

  const label = 'On this page';

  return (
    <StyledContents displayOnDesktopOnly={displayOnDesktopOnly}>
      <ContentsList label={label}>
        {headingNodes.map(({ depth, id, title }) => {
          // Depth of heading nodes refers to their depth in the AST
          const listItemDepth = depth - 2;
          return (
            <ContentsListItem depth={listItemDepth} key={id} id={id} isActive={activeHeadingId === id}>
              {formatText(title, formatTextOptions)}
            </ContentsListItem>
          );
        })}
      </ContentsList>
    </StyledContents>
  );
};

Contents.propTypes = {
  displayOnDesktopOnly: PropTypes.bool,
};

export default Contents;
