import React, { useState } from 'react';
import styled from '@emotion/styled';
import loadable from '@loadable/component';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { useFeedbackContext } from '../context';
import { isBrowser } from '../../../../utils/is-browser';
import useScreenSize from '../../../../hooks/useScreenSize';
import { theme } from '../../../../theme/docsTheme';
const Tooltip = loadable(() => import('./LeafygreenTooltip'));

// Given a string, convert all regular space characters to non-breaking spaces
const convertSpacesToNbsp = (someString) => {
  const nbsp = '\xa0';
  return someString.replace(/\s/g, nbsp);
};

const FILLED_STAR_COLOR = palette.green.light1;
const UNFILLED_STAR_COLOR = palette.white;

const starIconStyle = (isHighlighted) => css`
  color: ${isHighlighted ? FILLED_STAR_COLOR : UNFILLED_STAR_COLOR};
  stroke-width: ${isHighlighted ? 1 : 0.5}px;
  stroke: ${palette.gray.dark2};
  // Ensures that containing divs do not overflow
  display: block;

  // Prevents mousedown events from causing focus styling to appear
  :focus:not(:focus-visible) {
    outline: none;
  }

  // Allows focus styling only on keyboard interaction
  :focus-visible {
    outline-color: ${palette.blue.light1};
    outline-offset: 1px;
    border-radius: 6px;
  }
`;

const Layout = styled.div`
  display: flex;
  gap: ${theme.size.small};
  justify-content: center;
  margin: ${theme.size.default} 0 ${theme.size.small};

  @media ${theme.screenSize.upToLarge} {
    gap: 12px;
  }
`;

const StarContainer = styled.div`
  cursor: pointer;
`;

export const StarRatingLabel = styled.div`
  margin-top: 12px;
`;

export const RATING_TOOLTIPS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Neutral',
  4: 'Good',
  5: 'Very Good',
};

const Star = ({
  ratingValue,
  isHighlighted,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onKeyDown,
  onBlur,
  triggerEnabled,
}) => {
  const { isTabletOrMobile } = useScreenSize();
  const starSize = isTabletOrMobile ? 32 : 24;

  return (
    <div onClick={onClick} onMouseLeave={onMouseLeave}>
      <Tooltip
        key={`star-${ratingValue}`}
        justify="middle"
        triggerEvent="hover"
        enabled={triggerEnabled}
        usePortal={false}
        trigger={
          <StarContainer>
            <Icon
              data-testid={`rating-star${isHighlighted ? '-highlighted' : ''}`}
              className={starIconStyle(isHighlighted)}
              glyph="Favorite"
              size={starSize}
              // Change default viewbox to allow focus outline to be more centered
              viewBox="0 -0.5 16 16"
              onMouseEnter={onMouseEnter}
              tabIndex={0}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
            />
          </StarContainer>
        }
      >
        {convertSpacesToNbsp(RATING_TOOLTIPS[ratingValue])}
      </Tooltip>
    </div>
  );
};

const StarRating = ({ className, handleRatingSelection = () => {}, editable = true }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const [lastHoveredRating, setLastHoveredRating] = useState(null);
  const { selectedRating } = useFeedbackContext();

  const hoverStar = (ratingValue) => {
    setHoveredRating(ratingValue);
    setLastHoveredRating(ratingValue);
  };

  const handleMouseLeaveStar = () => {
    setHoveredRating(lastHoveredRating);
  };

  const resetHoverStates = () => {
    setHoveredRating(null);
    setLastHoveredRating(null);
  };

  const handleKeyDown = (e, ratingValue) => {
    const validKeys = ['Enter', 'Space'];
    if (validKeys.includes(e.code)) {
      e.preventDefault();
      handleRatingSelection(ratingValue);
    }
  };

  return (
    isBrowser && (
      <Layout className={className} onMouseLeave={resetHoverStates}>
        {[1, 2, 3, 4, 5].map((ratingValue) => {
          const isHighlighted = hoveredRating ? hoveredRating >= ratingValue : selectedRating >= ratingValue;
          const eventProps = editable
            ? {
                onMouseEnter: () => hoverStar(ratingValue),
                onMouseLeave: () => handleMouseLeaveStar(),
                onFocus: () => hoverStar(ratingValue),
                onBlur: () => resetHoverStates(),
                onClick: () => handleRatingSelection(ratingValue),
                onKeyDown: (e) => handleKeyDown(e, ratingValue),
              }
            : {};

          return (
            <Star
              key={ratingValue}
              ratingValue={ratingValue}
              isHighlighted={isHighlighted}
              triggerEnabled={editable}
              {...eventProps}
            />
          );
        })}
      </Layout>
    )
  );
};

export default StarRating;
