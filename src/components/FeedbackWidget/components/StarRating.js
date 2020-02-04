import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useFeedbackState } from '../context';
import { css } from '@emotion/core';
import { isBrowser } from '../../../utils/is-browser';
import { uiColors } from '@leafygreen-ui/palette';
import loadable from '@loadable/component';
const Tooltip = loadable(() => import('./LeafygreenTooltip'));

const FILLED_STAR_COLOR = uiColors.yellow.base;
const UNFILLED_STAR_COLOR = uiColors.gray.light2;
export const RATING_TOOLTIPS = {
  1: 'Not at all',
  2: 'A little',
  3: 'Somewhat',
  4: 'Very',
  5: 'Extremely',
};

const filledStarIcon = findIconDefinition({ prefix: 'fas', iconName: 'star' });

export const StarRatingLabel = styled.div`
  margin-top: 12px;
`;

// export default function StarRating({ size = '3x' }) {
export default function StarRating({ size = '3x' }) {
  const [hoveredRating, setHoveredRating] = React.useState(null);
  const { feedback } = useFeedbackState();
  const selectedRating = feedback && feedback.rating;
  return (
    isBrowser() && (
      <Layout size={size}>
        {[1, 2, 3, 4, 5].map(ratingValue => (
          <Star
            key={ratingValue}
            ratingValue={ratingValue}
            hoveredRating={hoveredRating}
            setHoveredRating={setHoveredRating}
            selectedRating={selectedRating}
            onMouseEnter={() => setHoveredRating(ratingValue)}
            onMouseLeave={() => setHoveredRating(null)}
            size={size}
          />
        ))}
      </Layout>
    )
  );
}

export function Star({ ratingValue, hoveredRating, selectedRating, size, onMouseEnter, onMouseLeave }) {
  const isHighlighted = selectedRating ? selectedRating >= ratingValue : hoveredRating >= ratingValue;
  const isHovered = hoveredRating === ratingValue;
  const { setRating } = useFeedbackState();
  const onClick = () => setRating(ratingValue);
  return (
    <StarContainer onClick={onClick} onMouseLeave={onMouseLeave}>
      <Tooltip
        key={`star-${size}-${ratingValue}`}
        id={`star-${size}-${ratingValue}`}
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        variant="dark"
        open={isHovered && !selectedRating}
        trigger={
          <div>
            <StarIcon size={size} onMouseEnter={onMouseEnter} isHighlighted={isHighlighted} />
          </div>
        }
      >
        {`${RATING_TOOLTIPS[ratingValue]} helpful`}
      </Tooltip>
    </StarContainer>
  );
}

const widthForSize = size => {
  switch (size) {
    case 'lg':
      return '140px';
    case '2x':
      return '200px';
    case '3x':
      return '100%';
    default:
      return '100%';
  }
};
const marginForSize = size => {
  switch (size) {
    case 'lg':
      return '-24px 0 0px 0';
    case '2x':
      return '20px 0 24px 0';
    case '3x':
      return '20px 0 20px 0';
    default:
      return '20px 0 20px 0';
  }
};
const Layout = styled.div(
  props => css`
    display: flex;
    flex-direction: row;
    width: ${widthForSize(props.size)};
    justify-content: space-between;
    margin: ${marginForSize(props.size)};
  `
);

const StarContainer = styled.div`
  padding-right: auto;
  padding-left: auto;
`;

const StarIcon = ({ size, onMouseEnter, isHighlighted, ...props }) => (
  <FontAwesomeIcon
    icon={filledStarIcon}
    size={size}
    onMouseEnter={onMouseEnter}
    color={isHighlighted ? FILLED_STAR_COLOR : UNFILLED_STAR_COLOR}
    {...props}
  />
);
