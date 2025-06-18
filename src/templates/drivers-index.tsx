import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import Breadcrumbs from '../components/Breadcrumbs';
import MainColumn from '../components/MainColumn';
import { PageContext } from '../types/data';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
  grid-template-columns: minmax(${theme.size.xlarge}, auto) 1fr;
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
`;

export type DriversIndexProps = {
  children: ReactNode;
  pageContext: PageContext;
  offlineBanner: JSX.Element;
};

const DriversIndex = ({ children, pageContext: { slug }, offlineBanner }: DriversIndexProps) => {
  const { title, parentPaths } = useSnootyMetadata();
  return (
    <DocumentContainer>
      <StyledMainColumn>
        <div className="body">
          {offlineBanner}
          <Breadcrumbs parentPathsProp={parentPaths[slug]} siteTitle={title} slug={slug} />
          {children}
        </div>
      </StyledMainColumn>
    </DocumentContainer>
  );
};

export default DriversIndex;
