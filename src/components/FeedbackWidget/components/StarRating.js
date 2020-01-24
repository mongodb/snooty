import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { uiColors } from '@leafygreen-ui/palette';
import Tooltip from '@leafygreen-ui/tooltip';
import { useFeedbackState } from '../context';
import { css } from '@emotion/core';

const FILLED_STAR_COLOR = uiColors.yellow.base;
const UNFILLED_STAR_COLOR = uiColors.gray.light2;
const RATING_TOOLTIPS = {
  1: 'Unusable',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

const filledStarIcon = findIconDefinition({ prefix: 'fas', iconName: 'star' });

export default function StarRating({ size = '3x' }) {
  const [hoveredRating, setHoveredRating] = React.useState(null);
  const { feedback } = useFeedbackState();
  const selectedRating = feedback && feedback.rating;
  return (
    <Layout size={size} onMouseLeave={() => setHoveredRating(null)}>
      <Star
        ratingValue={1}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={2}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={3}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={4}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={5}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
    </Layout>
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

export function Star({ ratingValue, hoveredRating, setHoveredRating, selectedRating, size }) {
  const isHighlighted = selectedRating ? selectedRating >= ratingValue : hoveredRating >= ratingValue;
  const isHovered = hoveredRating === ratingValue;
  const { setRating } = useFeedbackState();
  const onMouseEnter = () => setHoveredRating(ratingValue);
  const onMouseLeave = () => setHoveredRating(null);
  const onClick = () => setRating(ratingValue);
  return (
    <StarContainer onClick={onClick} onMouseLeave={onMouseLeave}>
      <Tooltip
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
        {RATING_TOOLTIPS[ratingValue]}
      </Tooltip>
    </StarContainer>
  );
}
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
