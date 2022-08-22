import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import CaptionLegend from './CaptionLegend';
import Lightbox from './Lightbox';
import Image from '../Image';
import { getNestedValue } from '../../utils/get-nested-value';
import { theme } from '../../theme/docsTheme';

export default class Figure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLightboxSize: false,
    };
  }

  imgShouldHaveLightbox = (img) => {
    const naturalArea = img.naturalWidth * img.naturalHeight;
    const clientArea = img.clientWidth * img.clientHeight;
    return clientArea < naturalArea * 0.9;
  };

  handleImageLoaded = (imgRef) => {
    this.setState({
      isLightboxSize: this.imgShouldHaveLightbox(imgRef),
    });
  };

  render() {
    const { nodeData, ...rest } = this.props;
    const { isLightboxSize } = this.state;

    if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
      return <Lightbox nodeData={nodeData} />;
    }
    return (
      <div
        className="figure"
        css={css`
          max-width: 100%;
          margin-top: ${theme.size.medium};
          margin-bottom: ${theme.size.medium};
        `}
        style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}
      >
        <Image nodeData={nodeData} handleImageLoaded={this.handleImageLoaded} />
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
