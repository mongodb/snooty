import { useStaticQuery, graphql } from 'gatsby';
import { Docset } from '../types/data';

export type DocsetSlice = Omit<Docset, 'repoName' | 'search' | 'internalOnly' | 'prodDeployable' | 'groups' | 'bucket'>;

type AllDocsetsQueryResult = {
  allDocset: {
    nodes: DocsetSlice[];
  };
};

// Return an array of MongoDB products
export const useAllDocsets = () => {
  const { allDocset } = useStaticQuery<AllDocsetsQueryResult>(
    graphql`
      query AllDocsets {
        allDocset {
          nodes {
            displayName
            prefix {
              dotcomprd
              dotcomstg
              prd
              stg
            }
            project
            branches {
              active
              eol_type
              gitBranchName
              offlineUrl
              urlSlug
              urlAliases
              versionSelectorLabel
            }
            hasEolVersions
            url {
              dev
              dotcomprd
              dotcomstg
              prd
              stg
              regression
            }
          }
        }
      }
    `
  );
  return allDocset.nodes;
};
