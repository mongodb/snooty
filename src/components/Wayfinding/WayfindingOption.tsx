import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getPlaintext } from '../../utils/get-plaintext';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import type { WayfindingNode } from '../../types/ast';

const optionStyle = ({ hideOption }: { hideOption: boolean }) => css`
  padding: 6px 12px;
  text-decoration: none;
  display: ${hideOption ? 'none' : 'flex'};
  align-items: center;
  min-height: 36px;
  border-radius: ${theme.size.small};
  border: 1px solid var(--wayfinding-border-color);
  color: var(--font-color-primary);
  background-color: var(--background-color-primary);
  font-size: ${theme.fontSize.small};
  line-height: 20px;

  :hover {
    border-color: ${palette.gray.base};
  }
`;

const imgStyle = css`
  margin-right: 12px;
`;

interface WayfindingOptionProps {
  nodeData: WayfindingNode;
  hideOption?: boolean;
}

const WayfindingOption = ({ nodeData: { options, argument }, hideOption = false }: WayfindingOptionProps) => {
  const optionLink = getPlaintext(argument);
  const title = options?.title;
  const lang = options?.language;
  const optionId = options?.id;

  const Icon =
    DRIVER_ICON_MAP[optionId as keyof typeof DRIVER_ICON_MAP] || DRIVER_ICON_MAP[lang as keyof typeof DRIVER_ICON_MAP];

  return (
    <a
      className={cx(optionStyle({ hideOption }))}
      href={optionLink}
      target={'_self'}
      onClick={() => {
        reportAnalytics('WayfindingOptionClicked', {
          optionId,
          optionLink,
        });
      }}
    >
      {Icon && <Icon className={imgStyle} width={24} height={24} />}
      <span>{title}</span>
    </a>
  );
};

export default WayfindingOption;
