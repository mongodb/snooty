import { useStaticQuery, graphql } from 'gatsby';
import { TocItem } from '../components/UnifiedSidenav/types';

export type TocQueryData = {
  toc: {
    tocTree: TocItem[];
  };
};

export const useUnifiedToc = () => {
  const { toc } = useStaticQuery<TocQueryData>(
    graphql`
      query GetUnifiedToc {
        toc {
          tocTree
        }
      }
    `
  );

  return toc?.tocTree ?? [];
};
