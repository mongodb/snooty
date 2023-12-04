import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useFeedbackContext } from '../context';
import { theme } from '../../../../theme/docsTheme';

//styling for individual dots in the progress bar
const Dot = styled('span')`
  height: ${theme.size.tiny};
  width: ${theme.size.tiny};
  background-color: ${(props) => (props.isActive ? `${palette.green.base}` : `${palette.gray.light2}`)};
  border-radius: 50%;
  display: inline-block;
`;

const DotSpan = styled('span')`
  display: flex;
  gap: ${theme.size.tiny};
`;

const StyledBar = styled('span')`
  align-self: center;
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
