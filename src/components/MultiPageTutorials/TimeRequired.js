import React from 'react';
import { css } from '@leafygreen-ui/emotion';
import Overline from '../Internal/Overline';
import { theme } from '../../theme/docsTheme';
import MPTNextLinkMini from './MPTNextLinkMini';
import { useMptPageOptions } from './hooks/useMptPageOptions';

const timeBaseStyle = css`
  font-weight: 600;
  line-height: ${theme.size.default};
  margin-top: 40px;
  margin-bottom: ${theme.size.default};
`;

const TimeRequired = () => {
  const options = useMptPageOptions();
  const time = options?.time_required;
  return (
    <>
      <Overline className={timeBaseStyle}>Read time {time} min</Overline>
      {/* Keeping at the bottom so that it can be more easily aligned regardless of what's above the Time component*/}
      <MPTNextLinkMini />
    </>
  );
};

export default TimeRequired;
