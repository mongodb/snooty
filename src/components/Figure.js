import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from './Lightbox';
import { getPathPrefix } from '../utils/get-path-prefix';

export default class Figure extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
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
    const { isLightboxSize } = this.state;
    const imgSrc = `${getPathPrefix()}${nodeData.argument[0].value}`;

    if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
      return <Lightbox nodeData={nodeData} />;
    }
    return (
      <div
        className="figure"
        style={{
          width: nodeData.options && nodeData.options.figwidth ? nodeData.options.figwidth : 'auto',
        }}
      >
        <img
          src={imgSrc}
          alt={nodeData.options.alt ? nodeData.options.alt : nodeData.argument[0].value}
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
