import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import { H2, H3, Subtitle, Body } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import useScreenSize from '../hooks/useScreenSize';
import ComponentFactory from './ComponentFactory';
import TabSelectors from './Tabs/TabSelectors';
import { TabContext } from './Tabs/tab-context';
import { InstruqtContext } from './Instruqt/instruqt-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';
import Permalink from './Permalink';

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

const Heading = ({ sectionDepth, nodeData, className, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = determineHeading(sectionDepth);
  const asHeading = sectionDepth >= 1 && sectionDepth <= 6 ? `h${sectionDepth}` : 'h6';
  const isPageTitle = sectionDepth === 1;
  const { isMobile, isTabletOrMobile } = useScreenSize();
  const { selectors } = useContext(TabContext);
  const { hasDrawer, isOpen, setIsOpen } = useContext(InstruqtContext);
  const hasSelectors = selectors && Object.keys(selectors).length > 0;
  const shouldShowLabButton = isPageTitle && hasDrawer;
  const shouldShowMobileHeader = !!(isPageTitle && isTabletOrMobile && hasSelectors);

  return (
    <>
      <ConditionalWrapper
        condition={shouldShowMobileHeader}
        wrapper={(children) => (
          <HeadingContainer stackVertically={isMobile}>
            {children}
            <ChildContainer isStacked={isMobile}>{hasSelectors && <TabSelectors />}</ChildContainer>
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
              disabled={isOpen}
              onClick={() => setIsOpen(true)}
              leftGlyph={<Icon glyph="Code" />}
            >
              {'Open Interactive Tutorial'}
            </Button>
          )}
        </HeadingTag>
      </ConditionalWrapper>
      {isPageTitle && <Contents />}
    </>
  );
};

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.stackVertically ? 'column' : 'row')};
  justify-content: space-between;
`;

const ChildContainer = styled.div(
  ({ isStacked }) => css`
    ${isStacked && 'margin: 4px 0 16px 0;'}
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${isStacked ? 'flex-start' : 'center'};
  `
);

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
};

export default Heading;
