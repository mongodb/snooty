import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { getNestedValue } from '../utils/get-nested-value';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      width: null,
    };
  }

  handleLoad = ({ target: img }) => {
    const { nodeData } = this.props;
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
    const { nodeData } = this.props;
    const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
    const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
    const customAlign = getNestedValue(['options', 'align'], nodeData)
      ? `align-${getNestedValue(['options', 'align'], nodeData)}`
      : '';

    const buildStyles = () => {
      const { height, width } = this.state;
      return {
        ...(height && { height }),
        ...(width && { width }),
      };
    };

    return (
      <img
        src={withPrefix(imgSrc)}
        alt={altText}
        className={[getNestedValue(['option', 'class'], nodeData), customAlign].join(' ')}
        style={nodeData.options ? buildStyles() : {}}
        onLoad={this.handleLoad}
      />
    );
  }
}

Image.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ),
    options: PropTypes.shape({
      align: PropTypes.string,
      alt: PropTypes.string,
      height: PropTypes.string,
      scale: PropTypes.string,
      width: PropTypes.string,
    }),
  }).isRequired,
};
