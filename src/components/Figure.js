import React, { Component } from 'react';
import { withPrefix } from 'gatsby';
import PropTypes from 'prop-types';
import CaptionLegend from './CaptionLegend';
import Lightbox from './Lightbox';
import { getNestedValue } from '../utils/get-nested-value';
// import { getAssetData } from '../../preview/preview-setup';

export default class Figure extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this._isMounted = false; // Can't use this.isMounted
    this.state = {
      isLightboxSize: false,
      base64Uri: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const img = this.imgRef.current;
    if (img && img.complete) {
      this.handleImageLoaded();
    }

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
    const { nodeData, ...rest } = this.props;
    const { isLightboxSize, base64Uri } = this.state;
    const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
    // Choose whether to show static asset file or via base64
    const imgData = !process.env.PREVIEW_PAGE ? withPrefix(imgSrc) : base64Uri;

    if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
      return <Lightbox nodeData={nodeData} base64Uri={base64Uri} />;
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
        <CaptionLegend {...rest} nodeData={nodeData} />
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
      checksum: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
