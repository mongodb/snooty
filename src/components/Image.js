import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { getNestedValue } from '../utils/get-nested-value';

export default class Image extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    // Can't use this.isMounted: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._isMounted = false;
    this.state = {
      base64Uri: null,
      height: null,
      width: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    // Get base64 image data
    if (process.env.PREVIEW_PAGE) {
      const { nodeData } = this.props;
      const checksum = getNestedValue(['options', 'checksum'], nodeData);

      // Get base64 data of image using checksum
      import('../../preview/preview-setup')
        .then(module => {
          return module.getBase64Uri(checksum);
        })
        .then(base64Uri => {
          // Only change the state if this is mounted. (Warning of memory leak otherwise)
          if (this._isMounted) {
            this.setState({ base64Uri });
          }
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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
    const { base64Uri } = this.state;
    const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
    const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
    const customAlign = getNestedValue(['options', 'align'], nodeData)
      ? `align-${getNestedValue(['options', 'align'], nodeData)}`
      : '';
    // Choose whether to show static asset file or via base64
    const imgData = !process.env.PREVIEW_PAGE ? withPrefix(imgSrc) : base64Uri;

    const buildStyles = () => {
      const { height, width } = this.state;
      return {
        ...(height && { height }),
        ...(width && { width }),
      };
    };

    return (
      <img
        src={imgData}
        alt={altText}
        className={[getNestedValue(['option', 'class'], nodeData), customAlign, className].join(' ')}
        style={nodeData.options ? buildStyles() : {}}
        onLoad={this.handleLoad}
        ref={this.imgRef}
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
