import styled from '@emotion/styled';
import { theme } from '../../../../theme/docsTheme';

export const Layout = styled.div`
  // display: flex;
  // flex-direction: column;
  // align-items: center;
`;

export const Heading = styled.h2`
  margin-top: 5px;
  margin-bottom: 16px;
  width: 100%;
  text-align: center;
  font-size: ${theme.fontSize.default};
`;

export const Subheading = styled.p`
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  text-align: center;
  font-weight: regular;
  font-size: ${theme.fontSize.small};
`;

export const Footer = styled.div`
  // margin-top: 0;
  // margin-bottom: 10px;
  // width: 100%;
  // font-weight: normal;
  // display: flex;
  // flex-direction: row-reverse;
  // justify-content: space-between;
  // align-items: center;
`;
