import React, { useState } from 'react';
import Tooltip from '@leafygreen-ui/tooltip';
import Icon from '@leafygreen-ui/icon';
import styled from '@emotion/styled';

const SyncCloud = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Sync onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Icon glyph="Cloud" fill="#000000" />
      <Tooltip triggerEvent="hover" align="top" justify="middle" darkMode={true} open={isHovered} popoverZIndex={2}>
        This involves Realm App Services.
        <br />
        You will need an Atlas account.
      </Tooltip>
    </Sync>
  );
};

const Sync = styled.div`
  margin-right: 10px;
  margin-top: 2px;
`;

export default SyncCloud;
