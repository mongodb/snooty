import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import Loadable from '@loadable/component';
import useScreenSize from '../hooks/useScreenSize';
import TabSelectors from './Tabs/TabSelectors';
import { TabContext } from './Tabs/tab-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';
import Permalink from './Permalink';
import { H2, H3, Subtitle, Body } from '@leafygreen-ui/typography';

const FeedbackHeading = Loadable(() => import('./Widgets/FeedbackWidget/FeedbackHeading'));

const StyledH2 = styled(H2)`
  margin-top: 16px;
  margin-bottom: 24px;
`;

const headingStyles = css`
  margin-top: 24px;
  margin-bottom: 8px;
`;

const determineHeading = (sectionDepth) => {
  if (sectionDepth === 1) {
    return StyledH2;
  } else if (sectionDepth === 2) {
    return H3;
  } else if (sectionDepth === 3) {
    return Subtitle;
  } else {
    return Body; // use weight=medium prop to style appropriately
  }
};

const Heading = ({ sectionDepth, nodeData, page, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = determineHeading(sectionDepth);
  const asHeading = sectionDepth >= 1 && sectionDepth <= 6 ? `h${sectionDepth}` : 'h6';
  const isPageTitle = sectionDepth === 1;
  const { isMobile, isTabletOrMobile } = useScreenSize();
  const hidefeedbackheader = page?.options?.hidefeedback === 'header';
  const { selectors } = useContext(TabContext);
  const hasSelectors = selectors && Object.keys(selectors).length > 0;
  const shouldShowMobileHeader = !!(isPageTitle && isTabletOrMobile && (hasSelectors || !hidefeedbackheader));

  return (
    <>
      <ConditionalWrapper
        condition={shouldShowMobileHeader}
        wrapper={(children) => (
          <HeadingContainer stackVertically={isMobile}>
            {children}
            <ChildContainer isStacked={isMobile}>
              {hasSelectors ? <TabSelectors /> : <FeedbackHeading isStacked={isMobile} />}
            </ChildContainer>
          </HeadingContainer>
        )}
      >
        <HeadingTag className={cx(headingStyles)} as={asHeading} weight="medium">
          {nodeData.children.map((element, index) => {
            return <ComponentFactory {...rest} nodeData={element} key={index} />;
          })}
          <Permalink id={id} description="heading" />
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
  page: PropTypes.object,
};

export default Heading;
