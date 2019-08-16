import React, { Component } from 'react';
import { withPrefix } from 'gatsby';
import PropTypes from 'prop-types';
import Lightbox from './Lightbox';
import { getNestedValue } from '../utils/get-nested-value';
import { getAssetData } from '../../preview/preview-setup';

export default class Figure extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.state = {
      isLightboxSize: false,
      base64Src: null,
    };
  }

  componentDidMount() {
    const img = this.imgRef.current;
    if (img && img.complete) {
      this.handleImageLoaded();
    }
    if (process.env.PREVIEW_PAGE) {
      const { nodeData } = this.props;
      const checksum = nodeData.options.checksum;
      getAssetData(checksum).then(assetData => {
        const base64 = assetData.data.buffer.toString('base64');
        const prefix = `data:image/${assetData.type.slice(1)};base64,`;
        const base64Src = prefix.concat(base64);

        this.setState({ base64Src });
      });
    }
  }

  imgShouldHaveLightbox = () => {
    const img = this.imgRef.current;
    const naturalArea = img.naturalWidth * img.naturalHeight;
    const clientArea = img.clientWidth * img.clientHeight;
    return clientArea < naturalArea * 0.9;
  };

  handleImageLoaded = () => {
    this.setState({
      isLightboxSize: this.imgShouldHaveLightbox(),
    });
  };

  render() {
    const { nodeData } = this.props;
    const { isLightboxSize, base64Src } = this.state;
    const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
    // Choose whether to show static asset file or via base64
    const imgData = !process.env.PREVIEW_PAGE ? withPrefix(imgSrc) : base64Src;

    if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
      return <Lightbox nodeData={nodeData} base64Src={base64Src} />;
    }
    return (
      <div className="figure" style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}>
        <img
          src={imgData}
          alt={getNestedValue(['options', 'alt'], nodeData) || imgSrc}
          width="50%"
          onLoad={this.handleImageLoaded}
          ref={this.imgRef}
        />
      </div>
    );
  }
}

Figure.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    options: PropTypes.shape({
      alt: PropTypes.string,
      lightbox: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};
