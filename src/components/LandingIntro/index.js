import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { H3 } from '@leafygreen-ui/typography';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';

const containerStyling = css(`
  background: ${palette.green.light3};
  padding: ${theme.size.large} 40px ${theme.size.large} ${theme.size.medium};
  grid-column: 2/-2;
  border-radius: ${theme.size.medium};
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: max-content;
  position: relative;
  column-gap: max(6%, 60px);

  > p {
    grid-row: 2;
    margin-bottom: ${theme.size.medium};
  }

  > a {
    grid-row: 3;
    width: fit-content;
  }

  > img {
    grid-row: 1/3;
    grid-column: 2;
    position: absolute;
    left: calc(50% - 150px);
    z-index: 1;
    top: calc(50% + 16px);
    transform: translateY(calc(-50%));
    height: auto;
    width: auto;
  }

  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: 60% 40%;
    column-gap: 35px;
  }

  @media ${theme.screenSize.upToMedium} {
    > img {
      left: 0;
    }
  }
  
  @media ${theme.screenSize.upToSmall} {
    grid-template-columns: 1fr;
    padding: 38px 18px;

    > img {
      grid-row: 1;
      grid-column: 1;
      position: relative;
      height: auto;
      width: 100%;
      z-index: 1;
      top: unset;
      transform: unset;
      margin-bottom: 20px;
    }

    > p {
      grid-row: 3;
    }

    > a {
      grid-row: 4;
    }

    h3, p, a {
      margin-left: 22px;
      margin-right: 22px;
    }
  }
`);

const headerStyling = css`
  grid-row: 1;
  margin-bottom: 20px;

  @media ${theme.screenSize.upToSmall} {
    grid-row: 2;
  }
`;

const LandingIntro = ({ nodeData: { children, options, argument } }) => {
  return (
    <div className={cx(containerStyling)}>
      <H3 className={cx(headerStyling)}>
        {argument.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
      </H3>
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} showLinkArrow={true} />
      ))}
    </div>
  );
};

export default LandingIntro;
