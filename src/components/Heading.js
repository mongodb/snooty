import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import styled from '@emotion/styled';
import Loadable from '@loadable/component';
import useScreenSize from '../hooks/useScreenSize';

const FeedbackHeading = Loadable(() => import('./Widgets/FeedbackWidget/FeedbackHeading'));

const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

const Heading = ({ sectionDepth, nodeData, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = sectionDepth >= 1 && sectionDepth <= 6 ? `h${sectionDepth}` : 'h6';

  const isPageTitle = sectionDepth === 1;
  const { isTabletOrMobile, isSmallScreen } = useScreenSize();
  const shouldShowStarRating = isPageTitle && isTabletOrMobile;

  return (
    <ConditionalWrapper
      condition={shouldShowStarRating}
      wrapper={children => (
        <HeadingContainer stackVertically={isSmallScreen}>
          {children}
          <FeedbackHeading isStacked={isSmallScreen} />
        </HeadingContainer>
      )}
    >
      <HeadingTag class="contains-headerlink" id={id}>
        {nodeData.children.map((element, index) => {
          return <ComponentFactory {...rest} nodeData={element} key={index} />;
        })}
        <a className="headerlink" href={`#${id}`} title="Permalink to this headline">
          ¶
        </a>
      </HeadingTag>
    </ConditionalWrapper>
  );
};

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.stackVertically ? 'column' : 'row')};
  justify-content: space-between;
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
};

export default Heading;
