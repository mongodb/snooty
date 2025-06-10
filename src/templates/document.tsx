import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import { InternalPageNav } from '../components/InternalPageNav';
import { StepNumber, useActiveMpTutorial } from '../components/MultiPageTutorials';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/Tabs/TabSelectors';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import AssociatedVersionSelector from '../components/AssociatedVersionSelector';
import { theme } from '../theme/docsTheme';
import { usePageContext } from '../context/page-context';
import DismissibleSkillsCard from '../components/DismissibleSkillsCard';
import { AppData, PageContext } from '../types/data';

const MAX_ON_THIS_PAGE_WIDTH = '200px';
const MAX_CONTENT_WIDTH = '775px';
const MAX_CONTENT_WIDTH_LARGE_SCREEN = '884px';
// (max content width along with padding + max "On This Page" width along with padding)
export const DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE = `(${MAX_CONTENT_WIDTH} + ${theme.size.xlarge} * 2) + (${MAX_ON_THIS_PAGE_WIDTH} + 5px + ${theme.size.medium})`;
export const DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE_LARGE_SCREEN = `(${MAX_CONTENT_WIDTH_LARGE_SCREEN} + ${theme.size.xlarge} * 2) + (${MAX_ON_THIS_PAGE_WIDTH} + 5px + ${theme.size.medium})`;

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
  grid-template-columns: minmax(0, calc(${MAX_CONTENT_WIDTH} + ${theme.size.xlarge} * 2)) 1fr;
  margin: 0 auto;
  width: 100%;
  max-width: calc(${DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE});

  @media ${theme.screenSize['3XLargeAndUp']} {
    grid-template-columns: minmax(0, calc(${MAX_CONTENT_WIDTH_LARGE_SCREEN} + ${theme.size.xlarge} * 2)) 1fr;
    max-width: calc(${DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE_LARGE_SCREEN});
  }
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
  max-width: ${MAX_CONTENT_WIDTH};

  @media ${theme.screenSize['3XLargeAndUp']} {
    max-width: ${MAX_CONTENT_WIDTH_LARGE_SCREEN};
  }
`;

const StyledRightColumn = styled(RightColumn)`
  grid-area: right;
  overflow: visible;
`;

export type DocumentTemplateProps = {
  children: ReactNode;
  data: AppData;
  pageContext: PageContext;
  offlineBanner: JSX.Element;
};

const Document = ({
  children,
  data: { page },
  pageContext: { slug, isAssociatedProduct },
  offlineBanner,
}: DocumentTemplateProps) => {
  const { slugToBreadcrumbLabel, title, toctreeOrder } = useSnootyMetadata();
  const pageOptions = page?.ast.options;
  const showPrevNext = !(pageOptions?.noprevnext === '' || pageOptions?.template === 'guide');
  const { tabsMainColumn } = usePageContext();
  const hasMethodSelector = pageOptions?.has_method_selector;
  const activeTutorial = useActiveMpTutorial();
  const dismissibleSkillsCard = pageOptions?.dismissible_skills_card;

  return (
    <DocumentContainer>
      <StyledMainColumn>
        <div className="body">
          {offlineBanner}
          <Breadcrumbs siteTitle={title} slug={slug} />
          {activeTutorial && <StepNumber slug={slug} activeTutorial={activeTutorial} />}
          {children}
          {showPrevNext && (
            <InternalPageNav slug={slug} slugTitleMapping={slugToBreadcrumbLabel} toctreeOrder={toctreeOrder} />
          )}
        </div>
      </StyledMainColumn>
      <StyledRightColumn hasDismissibleSkillsCard={!!dismissibleSkillsCard}>
        {!!dismissibleSkillsCard && (
          <DismissibleSkillsCard skill={dismissibleSkillsCard.skill} url={dismissibleSkillsCard.url} slug={slug} />
        )}
        {isAssociatedProduct && <AssociatedVersionSelector />}
        {!hasMethodSelector && !tabsMainColumn && <TabSelectors rightColumn={true} />}
        <Contents slug={slug} />
      </StyledRightColumn>
    </DocumentContainer>
  );
};

export default Document;
