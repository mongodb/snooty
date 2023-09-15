import React from 'react';
import { H3 } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../../ComponentFactory';
import { theme } from '../../../theme/docsTheme';
// import { withPrefix } from 'gatsby';
// import { createGlyphComponent, createIconComponent} from '@leafygreen-ui/icon';

const ExploreItem = styled('div')`
  background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="308" height="337" viewBox="0 0 308 337" fill="none"><path d="M183.5 11.2773L183.5 11.2907C183.875 39.1797 204.911 61.9519 230.994 61.9519H322.506C347.71 61.9519 368 84.0794 368 111.024V260.048C368 314.013 327.418 358 277.119 358C226.813 358 185.869 314.402 185.869 260.048V209.976C185.869 182.064 164.447 159.301 138.375 159.301H46.494C21.6488 159.301 1 137.561 1 110.229V11.6747C1 -15.2539 21.6438 -37 46.494 -37H138.006C162.866 -37 183.5 -15.6405 183.5 11.2773Z" stroke="%2300ED64" margin-left="865px" stoke-width="2"/></svg>');
  background-position: right;
  background-repeat: no-repeat;
  background-color: ${palette.black};
  //padding: 24px 108px 0 65px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1 1 auto;
  grid-column-start: 2;
  grid-column-end: 14;
  column-gap: 63px;
  row-gap: 32px;
  max-width: 1440px;
  min-height: 336px;

  @media ${theme.screenSize.upToLarge} {
    flex-direction: row;
    //flex: auto;
    padding: 2px 52px 0 42px;
  }

  @media ${theme.screenSize.LargeAndUp} {
    padding: 24px 52px 0 65px;
  }

  @media ${theme.screenSize.xLargeAndUp} {
    padding: 24px 108px 0 65px;
  }
`;

const leftCol = css`
  flex: 2 0 350px;

  @media ${theme.screenSize.upToLarge} {
    flex: 1 0 100%;
    width: 100%;
  }

  p {
    color: ${palette.gray.light2};
  }
`;

const blockStyle = css`
  height: 224px;
  padding-top: 8px;
  font-size: 13px;
  //min-width: 425px;
  max-width: 682px;
  //padding-bottom: 100px;
  @media ${theme.screenSize.upToLarge} {
    padding-bottom: 0px;
    min-width: 0px;
    //flex: 1 0 auto;
    width: 100%;
  }
  @media ${theme.screenSize.xLargeAndUp} {
    min-width: 425px;
    flex: 1 0 425px;
  }
`;

const HeaderStyle = styled('div')`
  width: 329px;
  //height: 32px;
  padding-top: 50px;
  padding-bottom: 24px;
  width: 100%;
`;

// const buttonStyle = css `
//     display: flex;
//     height: 36px;
//     padding: 8px 12px;
//     justify-content: center;
//     align-items: center;
//     gap: 6px;
//     flex-shrink: 0;
//     align-self: stretch;
// `;

// const exportGlyph = {
//   CustomGlyph: createGlyphComponent('MyCustomGlyph', props => (
//     <svg>src= {withPrefix('assets/export.svg')}</svg>
//   )
//   )
// };

// const exportComponent =createIconComponent(exportGlyph);

const Explore = ({ nodeData: { children } }) => {
  console.log(children[0].children[0].value);
  return (
    <ExploreItem>
      <div className={cx(leftCol)}>
        <HeaderStyle>
          <H3 as="h2" darkMode={true}>
            {children[0].children[0].value}
          </H3>
        </HeaderStyle>
        <div>
          {children.slice(1, 3).map((child, i) => (
            <ComponentFactory
              key={i}
              nodeData={child}
              baseFontSize={'16'}
              darkMode={true}
              variant={'default'}
              rightGlyph={'Export'}
            ></ComponentFactory>
          ))}
        </div>
      </div>

      <div className={cx(blockStyle)}>
        {children.slice(3).map((child, i) => (
          <ComponentFactory
            key={i}
            nodeData={child}
            darkMode={true}
            showLineNumbers={false}
            overflow={false}
          ></ComponentFactory>
        ))}
      </div>
    </ExploreItem>
  );
};

export default Explore;
