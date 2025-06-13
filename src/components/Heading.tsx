import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import { H2, H3, Subtitle, Body } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import useScreenSize from '../hooks/useScreenSize';
import { usePageContext } from '../context/page-context';
import { theme } from '../theme/docsTheme';
import { isOfflineDocsBuild } from '../utils/is-offline-docs-build';
import { disabledStyle } from '../styles/button';
import { HeadingNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import TabSelectors from './Tabs/TabSelectors';
import { TabContext } from './Tabs/tab-context';
import { InstruqtContext } from './Instruqt/instruqt-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';
import Permalink from './Permalink';
import { TimeRequired } from './MultiPageTutorials';

const titleMarginStyle = css`
  margin-top: ${theme.size.default};
  margin-bottom: ${theme.size.medium};
`;

const headingStyles = (sectionDepth: number, shouldShowLabButton: boolean) => css`
  ${!shouldShowLabButton &&
  `
    margin-top: ${theme.size.medium};
    margin-bottom: ${theme.size.small};
  `}
  color: ${sectionDepth < 2 ? `var(--heading-color-primary)` : `var(--font-color-primary)`};
`;

const labWrapperStyle = css`
  display: flex;
  gap: ${theme.size.default} ${theme.size.large};
  flex-wrap: wrap;
`;

// Theme-specific styles were copied from the original Button component
const labButtonStyling = css`
  align-self: center;
  background-color: ${palette.gray.light3};
  border-color: ${palette.gray.base};
  color: ${palette.black};

  .dark-theme & {
    background-color: ${palette.gray.dark2};
    border-color: ${palette.gray.base};
    color: ${palette.white};
  }
`;

const contentsStyle = css`
  margin-top: ${theme.size.medium};
`;

const determineHeading = (sectionDepth: number) => {
  if (sectionDepth === 1) {
    return H2;
  } else if (sectionDepth === 2) {
    return H3;
  } else if (sectionDepth === 3) {
    return Subtitle;
  }
  return Body; // use weight=medium prop to style appropriately
};

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function toHeadingTag(n: number): HeadingTag {
  if (n >= 1 && n <= 6) return `h${n}` as HeadingTag;
  return 'h6';
}

export type HeadingProps = {
  nodeData: HeadingNode;
  sectionDepth: number;
  as?: number;
  className?: string;
};

const Heading = ({ sectionDepth, nodeData, className, as, ...rest }: HeadingProps) => {
  const id = nodeData.id || '';
  const HeadingTag = determineHeading(sectionDepth);
  const asHeadingNumber = as ?? sectionDepth;
  const asHeading = toHeadingTag(asHeadingNumber);
  const isPageTitle = sectionDepth === 1;
  const { isTabletOrMobile } = useScreenSize();
  const { selectors } = useContext(TabContext);
  const { hasDrawer, isOpen, setIsOpen } = useContext(InstruqtContext);
  const hasSelectors = selectors && Object.keys(selectors).length > 0;
  const shouldShowLabButton = isPageTitle && hasDrawer;
  const { page, tabsMainColumn } = usePageContext();
  const hasMethodSelector = page?.options?.['has_method_selector'];
  const shouldShowMobileHeader = !!(isPageTitle && isTabletOrMobile && hasSelectors && !hasMethodSelector);
  const showRating = !(rest?.page?.options?.template === 'product-landing');

  return (
    <>
      <ConditionalWrapper
        condition={shouldShowMobileHeader}
        wrapper={(children) => (
          <HeadingContainer>
            {children}
            <ChildContainer>{hasSelectors && !tabsMainColumn && <TabSelectors rightColumn={true} />}</ChildContainer>
          </HeadingContainer>
        )}
      >
        {/* Wrapper for Instruqt drawer button */}
        <ConditionalWrapper
          condition={shouldShowLabButton}
          wrapper={(children) => (
            <div className={cx(titleMarginStyle, labWrapperStyle)}>
              {children}
              <Button
                role="button"
                className={cx(labButtonStyling, disabledStyle)}
                disabled={isOfflineDocsBuild || isOpen}
                onClick={() => setIsOpen(true)}
                leftGlyph={<Icon glyph="Code" />}
              >
                {'Open Interactive Tutorial'}
              </Button>
            </div>
          )}
        >
          <HeadingTag
            className={cx(
              headingStyles(sectionDepth, shouldShowLabButton),
              'contains-headerlink',
              isPageTitle && !hasDrawer ? titleMarginStyle : '',
              className
            )}
            as={asHeading}
            weight="medium"
          >
            {nodeData.children.map((element, index) => {
              return <ComponentFactory {...rest} nodeData={element} key={index} />;
            })}
            <Permalink id={id} description="heading" />
          </HeadingTag>
        </ConditionalWrapper>
      </ConditionalWrapper>
      {isPageTitle && isTabletOrMobile && showRating && (
        <>
          <TimeRequired />
          <Contents className={contentsStyle} slug={rest.slug} />
        </>
      )}
    </>
  );
};

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media ${theme.screenSize.upToLarge} {
    flex-direction: column;
  }
`;

const ChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${theme.screenSize.upToLarge} {
    margin: 4px 0 16px 0;
    align-items: flex-start;
  }
`;

export default Heading;
