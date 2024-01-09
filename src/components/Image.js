import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import { getNestedValue } from '../utils/get-nested-value';

const Image = ({ nodeData, className }) => {
  const scale = (parseInt(getNestedValue(['options', 'scale'], nodeData), 10) || 100) / 100;
  const height = getNestedValue(['options', 'height'], nodeData);
  const width = getNestedValue(['options', 'width'], nodeData);

  const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const imgAlignment = getNestedValue(['options', 'align'], nodeData);
  const customAlign = imgAlignment ? `align-${imgAlignment}` : '';

  const hasBorder = getNestedValue(['options', 'border'], nodeData);
  const borderStyling = css`
    border: 0.5px solid ${palette.gray.light1};
    width: 100%;
    border-radius: 4px;
  `;

  const { options: { class: directiveClass } = {} } = nodeData;

  return (
    <img
      src={withPrefix(imgSrc)}
      alt={altText}
      height={String(height * scale)}
      width={String(width * scale)}
      className={[directiveClass, customAlign, className].join(' ')}
      css={css`
        ${hasBorder ? borderStyling : ''}
        max-width: 100%;
        height: auto;
      `}
    />
  );
};

Image.propTypes = {
  className: PropTypes.string,
  handleImageLoaded: PropTypes.func,
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ),
    options: PropTypes.shape({
      align: PropTypes.string,
      alt: PropTypes.string,
      checksum: PropTypes.string,
      height: PropTypes.string,
      scale: PropTypes.string,
      width: PropTypes.string,
    }),
  }).isRequired,
};

Image.defaultProps = {
  className: '',
  handleImageLoaded: () => {},
};

export default Image;
