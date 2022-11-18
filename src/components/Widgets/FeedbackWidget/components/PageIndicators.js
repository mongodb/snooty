import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useFeedbackContext } from '../context';

//styling for individual dots in the progress bar
const Dot = styled('span')`
  height: 4px;
  width: 4px;
  background-color: ${(props) => (props.isActive ? `${palette.green.dark1}` : `${palette.gray.light2}`)};
  border-radius: 50%;
  display: inline-block;
  margin-right: 3px;
`;

const DotSpan = styled('span')`
  padding-right: 60px;
`;

const StyledBar = styled('span')`
  text-align: center !important;
  margin-bottom: 5px;
`;

const ProgressBar = () => {
  const { progress } = useFeedbackContext();
  return (
    <StyledBar>
      <DotSpan>
        {progress.map((value, i) => (
          <Dot isActive={value} key={i} />
        ))}
      </DotSpan>
    </StyledBar>
  );
};

export default ProgressBar;
