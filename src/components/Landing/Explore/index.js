import React from 'react';
import { H3 } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../../ComponentFactory';
import { theme } from '../../../theme/docsTheme';

const ExploreItem = styled.section`
  @media ${theme.screenSize.xLargeAndUp} {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="308" height="337" viewBox="0 0 308 337" fill="none"><path d="M183.5 11.2773L183.5 11.2907C183.875 39.1797 204.911 61.9519 230.994 61.9519H322.506C347.71 61.9519 368 84.0794 368 111.024V260.048C368 314.013 327.418 358 277.119 358C226.813 358 185.869 314.402 185.869 260.048V209.976C185.869 182.064 164.447 159.301 138.375 159.301H46.494C21.6488 159.301 1 137.561 1 110.229V11.6747C1 -15.2539 21.6438 -37 46.494 -37H138.006C162.866 -37 183.5 -15.6405 183.5 11.2773Z" stroke="%2300ED64" margin-left="865px" stoke-width="2"/></svg>');
    background-position: right;
    background-repeat: no-repeat;
  }
  background-color: ${palette.black};
  grid-column-start: 1;
  grid-column-end: 15;
  padding: 56px 0;
`;

const ExploreContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1 1 100%;
  grid-column: 2/-2;
  column-gap: 63px;
  row-gap: 32px;

  @media ${theme.screenSize.upToLarge} {
    flex-direction: row;
  }
`;

const HeaderStyle = styled.div`
  padding-bottom: 24px;

  @media ${theme.screenSize.mediumAndUp} {
    white-space: nowrap;
  }
`;

const leftCol = css`
  flex: 2 0 310px;
  font-size: 16px;
  @media ${theme.screenSize.upToLarge} {
    flex: 1 0 100%;
    width: 100%;
  }
  p {
    color: ${palette.gray.light2};
  }
`;

const blockStyle = css`
  font-size: 13px;
  max-width: 682px;
  @media ${theme.screenSize.upToLarge} {
    padding-bottom: 0px;
    min-width: 0px;
    flex: 1 0 100%;
    width: 100%;
  }
  @media ${theme.screenSize.xLargeAndUp} {
    flex: 1 0 425px;
    width: 100%;
  }
`;

const Explore = ({ nodeData: { children, argument }, ...rest }) => {
  const title = argument[0]?.value;
  return (
    <ExploreItem>
      <ExploreContent>
        <div className={cx(leftCol)}>
          <HeaderStyle>
            <H3 as="h2" darkMode={true}>
              {title}
            </H3>
          </HeaderStyle>
          <div>
            {children.slice(0, 2).map((child, i) => (
              <ComponentFactory
                key={i}
                nodeData={child}
                baseFontSize={16}
                darkMode={true}
                variant={'default'}
                rightGlyph={'Export'}
                hideExternalIcon={true}
              ></ComponentFactory>
            ))}
          </div>
        </div>

        <div className={cx(blockStyle)}>
          <ComponentFactory
            nodeData={children[2]}
            darkMode={true}
            showLineNumbers={false}
            overflow={false}
          ></ComponentFactory>
        </div>
      </ExploreContent>
    </ExploreItem>
  );
};

export default Explore;
