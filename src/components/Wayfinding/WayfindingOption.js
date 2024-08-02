import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getPlaintext } from '../../utils/get-plaintext';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { NOTRANSLATE_CLASS } from '../../utils/locale';
import { theme } from '../../theme/docsTheme';

const optionStyle = ({ hideOption }) => css`
  box-shadow: unset;
  padding: 6px 12px;
  text-decoration: none;
  display: ${hideOption ? 'none' : 'flex'};
  align-items: center;
  min-height: 36px;
  border-radius: 8px;
  border: 1px solid var(--wayfinding-border-color);
  color: var(--font-color-primary);
  background-color: var(--wayfinding-option-bg-color);
  font-size: ${theme.fontSize.small};
  line-height: 20px;

  :hover {
    box-shadow: unset;
    border-color: ${palette.gray.base};
  }
`;

const imgStyle = css`
  margin-right: 12px;
`;

const WayfindingOption = ({ nodeData: { options, argument }, hideOption = false }) => {
  const optionLink = getPlaintext(argument);
  const title = options?.title;
  const lang = options?.language;
  const optionId = options?.id;

  const Icon = DRIVER_ICON_MAP[optionId] || DRIVER_ICON_MAP[lang];

  return (
    <a className={cx(NOTRANSLATE_CLASS, optionStyle({ hideOption }))} href={optionLink}>
      {Icon && <Icon className={imgStyle} width={24} height={24} />}
      <span>{title}</span>
    </a>
  );
};

export default WayfindingOption;
