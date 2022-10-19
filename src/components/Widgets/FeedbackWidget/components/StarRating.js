import React from 'react';
import styled from '@emotion/styled';
import { useFeedbackState } from '../context';
import { css } from '@emotion/react';
import { isBrowser } from '../../../../utils/is-browser';
import { palette } from '@leafygreen-ui/palette';
import loadable from '@loadable/component';

import { StarIcon } from '../icons';
const Tooltip = loadable(() => import('./LeafygreenTooltip'));

// Given a string, convert all regular space characters to non-breaking spaces
function convertSpacesToNbsp(someString) {
  const nbsp = '\xa0';
  return someString.replace(/\s/g, nbsp);
}

const FILLED_STAR_COLOR = palette.yellow.base;
const UNFILLED_STAR_COLOR = palette.gray.light2;
export const RATING_TOOLTIPS = {
  1: 'Not at all',
  2: 'A little',
  3: 'Somewhat',
  4: 'Very',
  5: 'Extremely',
};

export const StarRatingLabel = styled.div`
  margin-top: 12px;
`;

export default function StarRating({ size = '3x' }) {
  const [hoveredRating, setHoveredRating] = React.useState(null);
  const { feedback, setRating } = useFeedbackState();
  const selectedRating = feedback && feedback.rating;
  return (
    isBrowser && (
      <Layout size={size}>
        {[1, 2, 3, 4, 5].map((ratingValue) => {
          const isHighlighted = selectedRating ? selectedRating >= ratingValue : hoveredRating >= ratingValue;
          const isHovered = hoveredRating === ratingValue;
          return (
            <Star
              key={ratingValue}
              ratingValue={ratingValue}
              isHighlighted={isHighlighted}
              shouldShowTooltip={isHovered && !selectedRating}
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(null)}
              size={size}
            />
          );
        })}
      </Layout>
    )
  );
}

export function Star({ ratingValue, isHighlighted, shouldShowTooltip, size, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <div onClick={onClick} onMouseLeave={onMouseLeave}>
      <Tooltip
        key={`star-${size}-${ratingValue}`}
        id={`star-${size}-${ratingValue}`}
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        open={shouldShowTooltip}
        usePortal={false}
        trigger={
          <StarContainer>
            <StarIcon
              size={size}
              onMouseEnter={onMouseEnter}
              style={{ color: isHighlighted ? FILLED_STAR_COLOR : UNFILLED_STAR_COLOR }}
            />
          </StarContainer>
        }
      >
        {convertSpacesToNbsp(`${RATING_TOOLTIPS[ratingValue]} helpful`)}
      </Tooltip>
    </div>
  );
}

const widthForSize = (size) => {
  switch (size) {
    case 'lg':
      return '140px';
    case '2x':
      return '100%';
    case '3x':
      return '100%';
    default:
      return '100%';
  }
};
const marginForSize = (size) => {
  switch (size) {
    case 'lg':
      return '0';
    case '2x':
      return '16px 0 32px 0';
    case '3x':
      return '32px 0 20px 0';
    default:
      return '20px 0 20px 0';
  }
};
const Layout = styled.div(
  (props) => css`
    display: flex;
    flex-direction: row;
    width: ${widthForSize(props.size)};
    justify-content: space-between;
    margin: ${marginForSize(props.size)};
  `
);

const StarContainer = styled.div`
  cursor: pointer;
`;
