import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getPlaintext } from '../../utils/get-plaintext';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';

const optionStyle = ({ hideOption }) => css`
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

const WayfindingOption = ({ nodeData: { options, argument }, hideOption = false }) => {
  const optionLink = getPlaintext(argument);
  const title = options?.title;
  const lang = options?.language;
  const optionId = options?.id;

  const Icon = DRIVER_ICON_MAP[optionId] || DRIVER_ICON_MAP[lang];

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

WayfindingOption.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      title: PropTypes.string,
      language: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default WayfindingOption;
