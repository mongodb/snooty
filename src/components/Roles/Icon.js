import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import Badge from '@leafygreen-ui/badge';
import { css } from '@emotion/core';

const cloudSyncStyle = css`
  padding-right: 8px;
  padding-bottom: 2px;
`;

const syncPillStyle = css`
  align-self: center;
  margin-left: 5px;
  position: relative;
  top: -3px;
`;

const RoleIcon = ({ nodeData: { target, name } }) => {
  if (target === 'sync-pill') {
    return (
      <Badge variant="lightgray" className="my-badge" css={syncPillStyle}>
        <img src={withPrefix('assets/cloud.png')} alt="Sync" css={cloudSyncStyle}></img>
        APP SERVICES
      </Badge>
    );
  } else if ((name === 'icon') | (name === 'icon-fa5')) {
    return <i className={`fa-${target} fas`}></i>;
  } else if (name === 'icon-fa5-brands') {
    return <i className={`fab fa-${target}`}></i>;
  } else if (name === 'icon-fa4') {
    return <i className={`fa4-${target} fa4`}></i>;
  } else if (name === 'icon-charts') {
    return <i className={`charts-icon-${target} charts-icon`}></i>;
  } else if (name === 'icon-mms') {
    return <i className={`mms-icon-${target} mms-icon`}></i>;
  }
};

RoleIcon.propTypes = {
  nodeData: PropTypes.shape({
    target: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleIcon;
