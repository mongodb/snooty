import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import styled from '@emotion/styled';
import Loadable from '@loadable/component';
import { theme } from '../theme/docsTheme';
import useScreenSize from '../hooks/useScreenSize';
import TabSelectors from './TabSelectors';
import { TabContext } from './tab-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';

const FeedbackHeading = Loadable(() => import('./Widgets/FeedbackWidget/FeedbackHeading'));

const Heading = ({ sectionDepth, nodeData, page, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = sectionDepth >= 1 && sectionDepth <= 6 ? `h${sectionDepth}` : 'h6';

  const isPageTitle = sectionDepth === 1;
  const { isTabletOrMobile } = useScreenSize();
  const hidefeedbackheader = page?.options?.hidefeedback === 'header';
  const { selectors } = useContext(TabContext);
  const hasSelectors = selectors && Object.keys(selectors).length > 0;
  const shouldShowMobileHeader = isPageTitle && isTabletOrMobile && (hasSelectors || !hidefeedbackheader);

  return (
    <>
      <ConditionalWrapper
        condition={shouldShowMobileHeader}
        wrapper={(children) => (
          <HeadingContainer>
            {children}
            <ChildContainer>{hasSelectors ? <TabSelectors /> : <FeedbackHeading />}</ChildContainer>
          </HeadingContainer>
        )}
      >
        <HeadingTag className="contains-headerlink" id={id}>
          {nodeData.children.map((element, index) => {
            return <ComponentFactory {...rest} nodeData={element} key={index} />;
          })}
          <a className="headerlink" href={`#${id}`} title="Permalink to this headline">
            ¶
          </a>
        </HeadingTag>
      </ConditionalWrapper>
      {isPageTitle && <Contents />}
    </>
  );
};

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media ${theme.screenSize.upToSmall} {
    border: 1px solid red;
    flex-direction: column;
  }
`;

const ChildContainer = styled.div`
  align-items: 'center';
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${theme.screenSize.upToSmall} {
    align-items: 'flex-start';
    margin: ${theme.size.tiny} 0 ${theme.size.default} 0;
    min-height: ${theme.size.xLarge};
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
  page: PropTypes.object,
};

export default Heading;
