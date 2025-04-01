import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Label } from '@leafygreen-ui/typography';
import { useFeedbackContext } from '../context';
import StarRating from '../components/StarRating';

const styledLabel = css`
  font-size: 13px;
  font-weight: 500 !important;
  --label-color: ${palette.gray.dark2};
  .dark-theme & {
    --label-color: ${palette.gray.light1};
  }
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
