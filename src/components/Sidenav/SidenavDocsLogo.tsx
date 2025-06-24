import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { baseUrl } from '../../utils/base-url';
import { theme } from '../../theme/docsTheme';

import DocsLogo from '../SVGs/DocsLogo';
import Link from '../Link';

const PaddedDocsLogo = styled(DocsLogo)`
  margin: 0px ${theme.size.medium};
`;

export type SidenavDocsLogoProps = {
  border: ReactNode;
};

const SidenavDocsLogo = ({ border, ...props }: SidenavDocsLogoProps) => {
  return (
    <>
      <Link to={baseUrl()}>
        <PaddedDocsLogo height={20} width={184} {...props} />
      </Link>
      {border}
    </>
  );
};

export default SidenavDocsLogo;
