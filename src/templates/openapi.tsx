import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { BaseTemplateProps } from '.';

const Wrapper = styled('div')`
  max-width: 100vw;
  min-height: 600px;
`;

const OpenAPITemplate = ({ children }: BaseTemplateProps & { children: ReactNode }) => <Wrapper>{children}</Wrapper>;

export default OpenAPITemplate;
