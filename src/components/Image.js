import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { css } from '@emotion/core';
import { getNestedValue } from '../utils/get-nested-value';
import { uiColors } from '@leafygreen-ui/palette';

export default class Image extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.state = {
      height: null,
      width: null,
    };
  }

  handleLoad = ({ target: img }) => {
    const { handleImageLoaded, nodeData } = this.props;

    handleImageLoaded(this.imgRef.current);

    const scale = getNestedValue(['options', 'scale'], nodeData);
    if (scale) {
      this.scaleSize(img.naturalWidth, img.naturalHeight, scale);
    } else {
      const height = getNestedValue(['options', 'height'], nodeData);
      const width = getNestedValue(['options', 'width'], nodeData);
      if (height) this.setState({ height });
      if (width) this.setState({ width });
    }
  };

  scaleSize = (width, height, scale) => {
    const scaleValue = parseInt(scale, 10) / 100.0;
    this.setState({
      height: height * scaleValue,
      width: width * scaleValue,
    });
  };

  render() {
    const { className, nodeData } = this.props;
    const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
    const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
    const customAlign = getNestedValue(['options', 'align'], nodeData)
      ? `align-${getNestedValue(['options', 'align'], nodeData)}`
      : '';

    const hasBorder = getNestedValue(['options', 'border'], nodeData);
    const borderStyling = css`
      border: 0.5px solid ${uiColors.gray.light1};
      width: 100%;
      border-radius: 4px;
    `;

    const buildStyles = () => {
      const { height, width } = this.state;
      return {
        ...(height && { height }),
        ...(width && { width }),
      };
    };

    const { options: { class: directiveClass } = {} } = nodeData;
    return (
      <img
        src={withPrefix(imgSrc)}
        alt={altText}
        className={[directiveClass, customAlign, className].join(' ')}
        style={nodeData.options ? buildStyles() : {}}
        onLoad={this.handleLoad}
        ref={this.imgRef}
        css={css`
          ${hasBorder ? borderStyling : ''}
          max-width: 100%;
        `}
      />
    );
  }
}

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
