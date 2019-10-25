import { useStaticQuery, graphql } from 'gatsby';

export const usePublishedBranches = () => {
  const {
    publishedBranches: {
      version: { active },
    },
  } = useStaticQuery(
    graphql`
      query PublishedBranches {
        publishedBranches {
          version {
            active
          }
        }
      }
    `
  );
  return active;
};
