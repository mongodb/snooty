import React from 'react';
import PropTypes from 'prop-types';
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
  background-color: ${palette.black};
  background-repeat: no-repeat;
  padding-left: 65px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  grid-column-start: 2;
  grid-column-end: 14;
  column-gap: 63px;
  max-width: 1440px;
  height: 336px;
  flex-shrink: 0;
  @media ${theme.screenSize.upToLarge} {
    flex-direction: column;
    width: 100%;
  }
`;

const leftCol = css`
  max-width: 600px;
  height: 79px;
  flex-shrink: 0;
  font-size: 16px;
  min-width: 50%;
  @media ${theme.screenSize.upToLarge} {
    margin-top: 0px;
    max-width: 100%;
  }
  p {
    color: #e8edeb;
  }
`;

const blockStyle = css`
  min-width: 425px;
  min-height: 224px;
  max-width: 50%;
`;

// const DescriptionItem = styled('div')`
//     color: ${palette.white};
//     font-feature-settings: 'clig' off, 'liga' off;
//     font-family: Euclid Circular A;
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 28px; /* 175% */
//     width: 536px;
//     height: 79px;
//     flex-shrink: 0;
// `;

const HeaderStyle = styled('div')`
  width: 329px;
  height: 32px;
  padding-top: 73.72px;
  padding-bottom: 44px;
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

const Explore = ({ nodeData: { children, argument }, ...rest }) => {
  let title = argument[0]?.value;
  return (
    <ExploreItem>
      <div className={cx(leftCol)}>
        <HeaderStyle>
          <H3 as="h2" darkMode={true}>
            {title}
          </H3>{' '}
          {/*  color?*/}
        </HeaderStyle>

        {children.slice(0, 2).map((child, i) => (
          <ComponentFactory
            key={i}
            nodeData={child}
            baseFontSize={'16'}
            darkMode={true}
            variant={'default'}
          ></ComponentFactory>
        ))}
      </div>

      <div className={cx(blockStyle)}>
        <ComponentFactory
          nodeData={children[2]}
          darkMode={true}
          showLineNumbers={false}
          switcher={true}
          languageOptions={['Python']}
        />
      </div>
    </ExploreItem>
  );
};

Explore.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
    darkMode: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Explore;
