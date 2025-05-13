import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

const Wrapper = styled('div')`
  max-width: 100vw;
  min-height: 600px;
`;

const OpenAPITemplate = ({ children }: { children: ReactNode }) => <Wrapper>{children}</Wrapper>;

export default OpenAPITemplate;
