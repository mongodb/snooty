import React, { useContext } from 'react';
import PropTypes from 'prop-types';
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
import ComponentFactory from './ComponentFactory';
import TabSelectors from './Tabs/TabSelectors';
import { TabContext } from './Tabs/tab-context';
import { InstruqtContext } from './Instruqt/instruqt-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';
import Permalink from './Permalink';
import { TimeRequired } from './MultiPageTutorials';
import CopyPageMarkdownButton from './Widgets/MarkdownWidget';

const titleMarginStyle = css`
  margin-top: ${theme.size.default};
  margin-bottom: ${theme.size.medium};
`;

const headingStyles = (sectionDepth, shouldShowLabButton) => css`
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

const determineHeading = (sectionDepth) => {
  if (sectionDepth === 1) {
    return H2;
  } else if (sectionDepth === 2) {
    return H3;
  } else if (sectionDepth === 3) {
    return Subtitle;
  }
  return Body; // use weight=medium prop to style appropriately
};

const Heading = ({ sectionDepth, nodeData, className, as, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = determineHeading(sectionDepth);
  const asHeadingNumber = as ?? sectionDepth;
  const asHeading = asHeadingNumber >= 1 && asHeadingNumber <= 6 ? `h${asHeadingNumber}` : 'h6';
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
            <div
              className={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              {nodeData.children.map((element, index) => {
                return <ComponentFactory {...rest} nodeData={element} key={index} />;
              })}
              <Permalink id={id} description="heading" />
              {/* using showRating since it has similar logic for showing the copy markdown button only for non-landing pages */}
              {isPageTitle && showRating && (
                <CopyPageMarkdownButton
                  className={css`
                    @media ${theme.screenSize.upToLarge} {
                      display: none;
                    }
                  `}
                />
              )}
            </div>
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

Heading.propTypes = {
  sectionDepth: PropTypes.number.isRequired,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  isProductLanding: PropTypes.bool,
  as: PropTypes.number,
};

export default Heading;
