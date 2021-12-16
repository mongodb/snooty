import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import Badge from '@leafygreen-ui/badge';
import { css } from '@emotion/core';

const cloudSyncStyle = css`
  padding-right: 8px;
  padding-bottom: 4px;
`;

const syncPillStyle = css`
  align-self: center;
  margin-left: 15px;
  position: relative;
  top: -4px;
  padding-bottom: 5px;
`;

const CloudSync = ({ nodeData: value }) => {
  return <h1>This is text! </h1>;
};

/*
if (!value) {
    console.log("no value was provided");
  } else {
    console.log("there was a value provided");
  }
  return <Badge variant="lightgray" className="my-badge" css={syncPillStyle}>
    <img src={withPrefix('assets/cloud.png')} alt="Sync" css={cloudSyncStyle}></img>
    APP SERVICES
  </Badge>;
*/

CloudSync.propTypes = {
  nodeData: PropTypes.shape({
    value: PropTypes.string,
  }).isRequired,
};

export default CloudSync;
