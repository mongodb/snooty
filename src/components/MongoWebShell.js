import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const SOURCE_URL = 'https://mws.mongodb.com/';

const MongoWebShell = ({
  nodeData: {
    options: { version },
  },
}) => {
  return (
    <iframe
      css={css`
        border: 0;
      `}
      title="MongoDB Web Shell"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin"
      width="100%"
      height="320"
      src={version ? `${SOURCE_URL}/?version=${version}` : SOURCE_URL}
    />
  );
};

MongoWebShell.propTypes = {
  nodeData: PropTypes.shape({
    options: PropTypes.shape({
      version: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default MongoWebShell;
