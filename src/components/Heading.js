import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import Tooltip from '@leafygreen-ui/tooltip';
import Badge from '@leafygreen-ui/badge';
import ComponentFactory from './ComponentFactory';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Loadable from '@loadable/component';
import useScreenSize from '../hooks/useScreenSize';
import TabSelectors from './TabSelectors';
import { TabContext } from './tab-context';
import ConditionalWrapper from './ConditionalWrapper';
import Contents from './Contents';
import { isBrowser } from '../utils/is-browser';
import useCopyClipboard from '../hooks/useCopyClipboard';

const FeedbackHeading = Loadable(() => import('./Widgets/FeedbackWidget/FeedbackHeading'));

const headingStyle = css`
  align-self: center;
  visibility: hidden;
  padding: 0 10px;
`;

const syncPillStyle = (sectionDepth) => css`
  align-self: center;
  margin-left: 15px;
  position: relative;
  display: ${sectionDepth === 1 ? 'inline-block' : 'none'};
  top: -4px;
  padding-bottom: 5px;
`;

const cloudSyncStyle = css`
  padding-right: 8px;
  padding-bottom: 4px;
`;

const Heading = ({ sectionDepth, nodeData, page, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = sectionDepth >= 1 && sectionDepth <= 6 ? `h${sectionDepth}` : 'h6';

  const isPageTitle = sectionDepth === 1;
  const { isMobile, isTabletOrMobile } = useScreenSize();
  const hidefeedbackheader = page?.options?.hidefeedback === 'header';
  const { selectors } = useContext(TabContext);
  const hasSelectors = selectors && Object.keys(selectors).length > 0;
  const shouldShowMobileHeader = isPageTitle && isTabletOrMobile && (hasSelectors || !hidefeedbackheader);

  const [copied, setCopied] = useState(false);
  const [headingNode, setHeadingNode] = useState(null);
  const url = isBrowser ? window.location.href.split('#')[0] + '#' + id : '';

  const [isHovered, setIsHovered] = React.useState(false);

  useCopyClipboard(copied, setCopied, headingNode, url);

  const handleClick = (e) => {
    setCopied(true);
  };

  return (
    <>
      <ConditionalWrapper
        condition={shouldShowMobileHeader}
        wrapper={(children) => (
          <>
            <HeadingContainer stackVertically={isMobile}>
              {children}
              <ChildContainer isStacked={isMobile}>
                {hasSelectors ? <TabSelectors /> : <FeedbackHeading isStacked={isMobile} />}
              </ChildContainer>
            </HeadingContainer>
          </>
        )}
      >
        <HeadingTag className="contains-headerlink">
          {nodeData.children.map((element, index) => {
            return <ComponentFactory {...rest} nodeData={element} key={index} />;
          })}

          <a
            className="headerlink"
            ref={setHeadingNode}
            css={headingStyle}
            href={`#${id}`}
            onClick={handleClick}
            title="Permalink to this headline"
          >
            <img src={withPrefix('assets/link.png')} alt="icons/link.png"></img>
            <Tooltip triggerEvent="click" open={copied} align="top" justify="middle" darkMode={true}>
              {'copied'}
            </Tooltip>
          </a>
          <HeaderBuffer id={id}></HeaderBuffer>
        </HeadingTag>
      </ConditionalWrapper>
      {isPageTitle && <Contents />}
    </>
  );
};

/*

<Badge variant="lightgray" className="my-badge" css={syncPillStyle(sectionDepth)}>
  <img src={withPrefix('assets/cloud.png')} alt="Sync" css={cloudSyncStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}></img>
  APP SERVICES
  <Tooltip triggerEvent="hover" align="top" justify="start" darkMode={true} open={isHovered}>
    {'This involves Realm App Services.\nYou will need an Atlas account.'}
  </Tooltip>
</Badge>

*/

const PillSyncCloud = styled.div(
  ({ sectionDepth }) => css`
    visibility: ${sectionDepth === 1 ? 'visible' : 'hidden'};
  `
);

const HeaderBuffer = styled.div`
  margin-top: -225px;
  position: absolute;
`;

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
