import React from 'react';
import { css } from '@leafygreen-ui/emotion';
import Overline from '../Internal/Overline';
import { theme } from '../../theme/docsTheme';
import { MPTNextLinkMini } from './MPTNextLinkMini';
import { useMptPageOptions } from './hooks/use-mpt-page-options';
import { OPTION_KEY_TIME_REQUIRED } from './constants';

const timeBaseStyle = css`
  font-weight: 600;
  line-height: ${theme.size.default};
  margin-top: 40px;
  margin-bottom: ${theme.size.default};
`;

export const TimeRequired = () => {
  const options = useMptPageOptions();
  const time = options?.[OPTION_KEY_TIME_REQUIRED as keyof typeof options];

  if (!time) {
    return null;
  }

  return (
    <>
      <Overline className={timeBaseStyle}>Read time {time} min</Overline>
      {/* Keeping at the bottom so that it can be more easily aligned regardless of what's above the Time component*/}
      <MPTNextLinkMini />
    </>
  );
};
