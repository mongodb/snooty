import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../theme/docsTheme';
import styled from '@emotion/styled';

import DocsLogo from '../SVGs/DocsLogo';

const PaddedDocsLogo = styled(DocsLogo)`
  margin: 0px ${theme.size.medium};
`;

const SidenavDocsLogo = ({ border, ...props }) => {
  return (
    <>
      <PaddedDocsLogo height={20} width={184} {...props} />
      {border}
    </>
  );
};

SidenavDocsLogo.propTypes = {
  border: PropTypes.element,
};

export default SidenavDocsLogo;
