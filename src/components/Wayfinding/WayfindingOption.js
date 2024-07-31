import React from 'react';
import Card from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getPlaintext } from '../../utils/get-plaintext';

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
  const imgAlt = `${lang} icon`;

  return (
    <Card className={cx(optionStyle)} href={optionLink}>
      <img
        className={cx(imgStyle)}
        alt={imgAlt}
        src={'https://www.mongodb.com/docs/assets/favicon.ico'}
        width={24}
        height={24}
      />
      <span>{title}</span>
    </Card>
  );
};

export default WayfindingOption;
