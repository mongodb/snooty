import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
export const useAllDocsets = () => {
  const { allDocset } = useStaticQuery(
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
              versionSelectorLabel
              eol_type
              urlSlug
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
