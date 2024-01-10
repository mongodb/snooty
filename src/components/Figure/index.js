import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Image from '../Image';
import { getNestedValue } from '../../utils/get-nested-value';
import { theme } from '../../theme/docsTheme';
import Lightbox from './Lightbox';
import CaptionLegend from './CaptionLegend';

export default class Figure extends Component {
  constructor(props) {
    super(props);
    const figWidth = parseInt(getNestedValue(['nodeData', 'options', 'figwidth'], props), 10);
    const imgWidth = parseInt(getNestedValue(['nodeData', 'options', 'width'], props), 10);
    this.state = {
      isLightboxSize: figWidth && figWidth / imgWidth < 0.9,
    };
  }

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
