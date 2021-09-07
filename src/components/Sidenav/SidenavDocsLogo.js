import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DocsLogo from '../SVGs/DocsLogo';
import { SideNavItem } from '@leafygreen-ui/side-nav';

const PaddedDocsLogo = styled(DocsLogo)`
  margin: 0px 16px;
`;

const SidenavDocsLogo = ({ border }) => {
  return (
    <>
      <SideNavItem disabled={true}>
        <PaddedDocsLogo height={20} width={184} />
      </SideNavItem>
      {border}
    </>
  );
};

SidenavDocsLogo.propTypes = {
  border: PropTypes.element,
};

export default SidenavDocsLogo;
