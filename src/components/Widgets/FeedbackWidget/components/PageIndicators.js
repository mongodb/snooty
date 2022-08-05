import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useFeedbackState } from '../context';

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
  padding-right: 72px;
`;

const StyledBar = styled('div')`
  text-align: center !important;
`;

const ProgressBar = () => {
  const { progress } = useFeedbackState();
  return (
    <StyledBar>
      <DotSpan>
        {progress.map((value) => (
          <Dot isActive={value} />
        ))}
      </DotSpan>
    </StyledBar>
  );
};

export default ProgressBar;
