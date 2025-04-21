import React, { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';

import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';

const collapsibleStyles = css`
  border-top: 1px solid ${palette.gray.light2};
  border-bottom: 1px solid ${palette.gray.light2};
  padding: 5px 0;
  margin-bottom: 24px;
`;

const headerStyles = css`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
`;

const labelStyles = css`
  --label-color: ${palette.gray.dark2};
  .dark-theme & {
    --label-color: ${palette.gray.light1};
  }
`;

const iconStyles = css`
  margin-left: -4px;

  color: ${palette.gray.dark1};

  .dark-theme & {
    color: ${palette.gray.light2};
  }
`;

const mobileLabelStyles = css`
  font-weight: 400;
  font-size: 13px;
  margin: 0;
  width: ${palette.gray.dark2};
`;

const desktopLabelStyles = css`
  font-size: ${theme.fontSize.small};
  line-height: ${theme.fontSize.default};
  font-weight: bolder;
  letter-spacing: 0;
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin: 0 0 12px !important;
`;

const listContainerStyles = css`
  overflow: hidden;
  height: 0;
  color: --font-color-primary;

  [aria-expanded='true'] & {
    height: auto;
  }
`;

const listStyles = css`
  list-style-type: none;
  padding: 0;
`;

const mobileListStyles = css`
  margin: 0;
  --label-color: ${palette.gray.dark2};
  .dark-theme & {
    --label-color: ${palette.gray.light1};
  }

  > li {
    margin: 6px 0 6px 13px;
  }
`;



const ContentsList = ({ children, label }: { children: ReactNode; label: string; }) => {
  const { isMobile } = useScreenSize();
  const [open, setOpen] = useState<boolean>(false);

  if (isMobile) {
    return (
      <Box aria-expanded={open} className={cx(collapsibleStyles)}>
        <Box className={cx(headerStyles)} onClick={() => setOpen(!open)}>
          <Icon className={cx(iconStyles)} glyph={open ? 'CaretDown' : 'CaretRight'} />
          <p className={cx(labelStyles, mobileLabelStyles)}>{label}</p>
        </Box>
        <Box className={cx(listContainerStyles)}>
          <ul className={cx(listStyles, mobileListStyles)}>{children}</ul>
        </Box>
      </Box>
    );
  }
  
  return (
    <>
      <p className={cx(labelStyles, desktopLabelStyles)}>{label}</p>
      <ul className={cx(listStyles)}>{children}</ul>
    </>
  );
};

export default ContentsList;
