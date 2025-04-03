import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { Label } from '@leafygreen-ui/typography';
import { useFeedbackContext } from '../context';
import StarRating from '../components/StarRating';

const styledLabel = css`
  font-size: 13px;
  font-weight: 500 !important;
  color: var(--label-color);
`;

const RatingView = () => {
  const { selectInitialRating } = useFeedbackContext();

  return (
    <>
      <Label className={cx(styledLabel)}>Rate this page</Label>
      <StarRating handleRatingSelection={selectInitialRating} />
    </>
  );
};

export default RatingView;
