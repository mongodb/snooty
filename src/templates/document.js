import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import { InternalPageNav } from '../components/InternalPageNav';
import { StepNumber } from '../components/MultiPageTutorials';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/Tabs/TabSelectors';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import AssociatedVersionSelector from '../components/AssociatedVersionSelector';
import { theme } from '../theme/docsTheme';
import { useActiveMPTutorial } from '../hooks/use-active-mp-tutorial';

const MAX_CONTENT_WIDTH = '775px';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
  grid-template-columns: minmax(0, calc(${MAX_CONTENT_WIDTH} + ${theme.size.xlarge} * 2)) 1fr;
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
  max-width: ${MAX_CONTENT_WIDTH};
`;

const StyledRightColumn = styled(RightColumn)`
  grid-area: right;
`;

const Document = ({ children, data: { page }, pageContext: { slug, isAssociatedProduct } }) => {
  const { slugToBreadcrumbLabel, title, toctreeOrder } = useSnootyMetadata();
  const pageOptions = page?.ast.options;
  const showPrevNext = !(pageOptions?.noprevnext === '' || pageOptions?.template === 'guide');
  const hasMethodSelector = pageOptions?.has_method_selector;
  const activeTutorial = useActiveMPTutorial();

  return (
    <DocumentContainer>
      <StyledMainColumn>
        <div className="body">
          <Breadcrumbs siteTitle={title} slug={slug} />
          {activeTutorial && <StepNumber slug={slug} activeTutorial={activeTutorial} />}
          {children}
          {showPrevNext && (
            <InternalPageNav slug={slug} slugTitleMapping={slugToBreadcrumbLabel} toctreeOrder={toctreeOrder} />
          )}
        </div>
      </StyledMainColumn>
      <StyledRightColumn>
        {isAssociatedProduct && <AssociatedVersionSelector />}
        {!hasMethodSelector && <TabSelectors />}
        <Contents displayOnDesktopOnly={true} />
      </StyledRightColumn>
    </DocumentContainer>
  );
};

Document.propTypes = {
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    page: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
        options: PropTypes.object,
      }).isRequired,
    }).isRequired,
  }),
};

export default Document;
