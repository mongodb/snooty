import React from 'react';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { H3 } from '@leafygreen-ui/typography';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';

const FlexboxContainer = styled('div')`
  grid-column: 2/-2;
  display: flex;
  column-gap: max(10%, 80px);
  background: ${palette.green.light3};
  border-radius: ${theme.size.medium};
  padding: 12px 40px;

  @media ${theme.screenSize.upToMedium} {
    flex-direction: column-reverse;
    padding: 38px 18px;
  }
  @media ${theme.screenSize.upToXLarge} {
    column-gap: 2rem;
  }
`;

const DescriptionContainer = styled('div')`
  padding: 28px 0;
  flex: 1 0 340px;

  > p {
    margin-bottom: ${theme.size.medium};
  }

  @media ${theme.screenSize.upToMedium} {
    padding: 0 22px;
    margin-top: 20px;
    flex: auto;
  }
  align-self: center;
`;

const ImageContainer = styled('div')`
  display: flex;
  flex: 1 1 440px;
  align-items: center;
  max-width: 440px;

  img {
    width: 100%;
    height: auto;
    z-index: unset;
  }

  @media ${theme.screenSize.upToMedium} {
    flex: auto;
    align-self: center;
  }
`;

const headerStyling = css`
  margin-bottom: 20px;
`;

const LandingIntro = ({ nodeData: { children, argument } }) => (
  <FlexboxContainer>
    <DescriptionContainer>
      <H3 as="h2" className={cx(headerStyling)}>
        {argument.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
      </H3>
      {/* assume first two children are paragraph and button */}
      {children.slice(0, 2).map((child, i) => (
        <ComponentFactory nodeData={child} key={i} />
      ))}
    </DescriptionContainer>
    <ImageContainer>
      {/* assume last child is image */}
      <ComponentFactory nodeData={children[2]} />
    </ImageContainer>
  </FlexboxContainer>
);

export default LandingIntro;
