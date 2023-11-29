import React, { useState } from 'react';
import styled from '@emotion/styled';
import loadable from '@loadable/component';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import { useFeedbackContext } from '../context';
import { isBrowser } from '../../../../utils/is-browser';
const Tooltip = loadable(() => import('./LeafygreenTooltip'));

// Given a string, convert all regular space characters to non-breaking spaces
const convertSpacesToNbsp = (someString) => {
  const nbsp = '\xa0';
  return someString.replace(/\s/g, nbsp);
};

const FILLED_STAR_COLOR = palette.green.light1;
const UNFILLED_STAR_COLOR = palette.white;

const Layout = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 16px 0 8px;
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

export const Star = ({ ratingValue, isHighlighted, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <div onClick={onClick} onMouseLeave={onMouseLeave}>
      <Tooltip
        key={`star-${ratingValue}`}
        justify="middle"
        triggerEvent="hover"
        usePortal={false}
        trigger={
          <StarContainer>
            <Icon
              glyph="Favorite"
              height={24}
              width={24}
              onMouseEnter={onMouseEnter}
              style={{
                color: isHighlighted ? FILLED_STAR_COLOR : UNFILLED_STAR_COLOR,
                stroke: palette.gray.dark2,
                strokeWidth: isHighlighted ? '1px' : '0.5px',
              }}
            />
          </StarContainer>
        }
      >
        {convertSpacesToNbsp(RATING_TOOLTIPS[ratingValue])}
      </Tooltip>
    </div>
  );
};

const StarRating = ({ handleRatingSelection = () => {} }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const { selectedRating } = useFeedbackContext();

  return (
    isBrowser && (
      <Layout>
        {[1, 2, 3, 4, 5].map((ratingValue) => {
          let isHighlighted = selectedRating ? selectedRating >= ratingValue : false;
          if (hoveredRating) {
            isHighlighted = hoveredRating >= ratingValue;
          }

          return (
            <Star
              key={ratingValue}
              ratingValue={ratingValue}
              isHighlighted={isHighlighted}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(null)}
              onClick={() => handleRatingSelection(ratingValue)}
            />
          );
        })}
      </Layout>
    )
  );
};

export default StarRating;
