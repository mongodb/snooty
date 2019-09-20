import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CaptionLegend from './CaptionLegend';
import Image from './Image';
import Lightbox from './Lightbox';
import { getNestedValue } from '../utils/get-nested-value';

export default class Figure extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    // Can't use this.isMounted: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._isMounted = false;
    this.state = {
      isLightboxSize: false,
    };
  }

  componentDidMount() {
    const img = this.imgRef.current;
    if (img && img.complete) {
      this.handleImageLoaded();
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
    const { isLightboxSize } = this.state;

    if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
      return <Lightbox nodeData={nodeData} />;
    }
    return (
      <div className="figure" style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}>
        <Image nodeData={nodeData} />
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
