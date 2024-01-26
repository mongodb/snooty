import React, { useContext } from 'react';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import { getLabURL } from './utils';
import { InstruqtContext } from './instruqt-context';

const buttonContainerStyle = css`
  display: flex;
  align-items: center;
  position: absolute;
  right: 17px;
  gap: 0 15px;

  @${theme.screenSize.upToMedium} {
    gap: 0 24px;
  }
`;

const iconStyle = css`
  color: ${palette.white};
  cursor: pointer;
`;

const DrawerButtons = ({ isMinHeight, targetHeight, setHeight, embedValue }) => {
  const { setIsOpen } = useContext(InstruqtContext);
  const drawerSizeGlyph = isMinHeight ? 'ArrowUp' : 'Minus';

  const handleDrawerSize = () => {
    setHeight(targetHeight);
  };

  const handleOpenLabInNewTab = () => {
    if (isBrowser) {
      const labSrc = getLabURL(embedValue);
      window.open(labSrc, '_blank');
    }
  };

  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={cx(buttonContainerStyle)}>
      <Icon className={cx(iconStyle)} width={16} height={16} onClick={handleDrawerSize} glyph={drawerSizeGlyph} />
      <Icon className={cx(iconStyle)} width={24} height={24} onClick={handleOpenLabInNewTab} glyph="OpenNewTab" />
      <Icon className={cx(iconStyle)} width={24} height={24} onClick={handleDrawerClose} glyph="X" />
    </div>
  );
};

export default DrawerButtons;
