import React from 'react';
import Card from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getPlaintext } from '../../utils/get-plaintext';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';

const optionStyle = css`
  box-shadow: unset;
  padding: 6px 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  min-height: 36px;
  border-radius: 8px;

  :hover {
    box-shadow: unset;
    border-color: ${palette.gray.base};
  }
`;

const imgStyle = css`
  margin-right: 12px;
`;

const WayfindingOption = ({ nodeData: { options, argument } }) => {
  const optionLink = getPlaintext(argument);
  const title = options?.title;
  const lang = options?.language;
  const optionId = options?.id;
  const Icon = DRIVER_ICON_MAP[optionId] || DRIVER_ICON_MAP[lang];

  return (
    <Card className={cx(optionStyle)} href={optionLink}>
      {Icon && <Icon className={imgStyle} width={24} height={24} />}
      <span>{title}</span>
    </Card>
  );
};

export default WayfindingOption;
