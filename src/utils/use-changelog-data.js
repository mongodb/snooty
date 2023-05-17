import { useStaticQuery, graphql } from 'gatsby';

export default function useChangelogData() {
  const data = useStaticQuery(graphql`
    query ChangelogData {
      allChangelogData {
        nodes {
          changelogData
        }
      }
    }
  `);

  return data.allChangelogData.nodes[0].changelogData;
}
