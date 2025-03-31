import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useFeedbackContext } from '../context';
import StarRating from '../components/StarRating';
import { Label } from '../../../Select';

const StyledLabel = styled(Label)`
  font-weight: 500;
  --label-color: ${palette.gray.dark2};
  .dark-theme & {
    --label-color: ${palette.gray.light1};
  }
  margin: 0px !important;
`;

const RatingView = () => {
  const { selectInitialRating } = useFeedbackContext();

  return (
    <>
      <StyledLabel>Rate this page</StyledLabel>
      {/* <p>Rate this page</p> */}
      <StarRating handleRatingSelection={selectInitialRating} />
    </>
  );
};

export default RatingView;
