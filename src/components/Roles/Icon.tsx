import React from 'react';
import { withPrefix } from 'gatsby';
import Badge from '@leafygreen-ui/badge';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { RoleIconNode } from '../../types/ast';

const cloudSyncStyle = css`
  padding-right: 7px;
`;

const syncPillStyle = css`
  align-self: center;
  margin-left: 4px;
  position: relative;
  top: -3px;
`;

const leafyGreenIconStyle = css`
  vertical-align: middle;
`;

export type RoleIconProps = {
  nodeData: RoleIconNode;
};

const RoleIcon = ({ nodeData: { target, name } }: RoleIconProps) => {
  if (target === 'sync-pill') {
    return (
      <Badge variant="lightgray" className={cx(syncPillStyle)}>
        <img src={withPrefix('assets/cloud.png')} alt="Sync" className={cx(cloudSyncStyle)} />
        APP SERVICES
      </Badge>
    );
  } else if (name === 'icon' || name === 'icon-fa5') {
    return <i className={`fa-${target} fas`}></i>;
  } else if (name === 'icon-fa5-brands') {
    return <i className={`fab fa-${target}`}></i>;
  } else if (name === 'icon-fa4') {
    return <i className={`fa4-${target} fa4`}></i>;
  } else if (name === 'icon-charts') {
    return <i className={`charts-icon-${target} charts-icon`}></i>;
  } else if (name === 'icon-mms') {
    return <i className={`mms-icon-${target} mms-icon`}></i>;
  } else if (name === 'icon-lg') {
    return <Icon glyph={target} className={cx(leafyGreenIconStyle)} />;
  }
};

export default RoleIcon;
