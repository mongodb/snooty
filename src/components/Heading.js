import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import { H2, H3, Subtitle, Body } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import useScreenSize from '../hooks/useScreenSize';
import { usePageContext } from '../context/page-context';
import { theme } from '../theme/docsTheme';
import { isOfflineDocsBuild } from '../utils/is-offline-docs-build';
import ComponentFactory from './ComponentFactory';
import TabSelectors from './Tabs/TabSelectors';
import { TabContext } from './Tabs/tab-context';
import { InstruqtContext } from './Instruqt/instruqt-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';
import Permalink from './Permalink';
import { TimeRequired } from './MultiPageTutorials';

const h2Styling = css`
  margin-top: 16px;
  margin-bottom: 24px;
`;

const headingStyles = (sectionDepth) => css`
  margin-top: 24px;
  margin-bottom: 8px;
  color: ${sectionDepth < 2 ? `var(--heading-color-primary)` : `var(--font-color-primary)`};
`;

const labButtonStyling = css`
  margin-left: 18px;
`;

const contentsStyle = css`
  margin-top: ${theme.size.medium};

  @media ${theme.screenSize.largeAndUp} {
    display: none;
  }
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
        <HeadingTag
          className={cx(
            headingStyles(sectionDepth),
            'contains-headerlink',
            sectionDepth === 1 ? h2Styling : '',
            className
          )}
          as={asHeading}
          weight="medium"
        >
          {nodeData.children.map((element, index) => {
            return <ComponentFactory {...rest} nodeData={element} key={index} />;
          })}
          <Permalink id={id} description="heading" />
          {shouldShowLabButton && (
            <Button
              role="button"
              className={cx(labButtonStyling)}
              disabled={isOfflineDocsBuild || isOpen}
              onClick={() => setIsOpen(true)}
              leftGlyph={<Icon glyph="Code" />}
            >
              {'Open Interactive Tutorial'}
            </Button>
          )}
        </HeadingTag>
      </ConditionalWrapper>
      {isPageTitle && (
        <>
          <TimeRequired />
          <Contents className={contentsStyle} />
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
