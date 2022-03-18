import { useStaticQuery, graphql } from 'gatsby';

export default function useSnootyMetadata() {
  const data = useStaticQuery(graphql`
    query Metadata {
      allSnootyMetadata {
        nodes {
          metadata
        }
      }
    }
  `);

  return data.allSnootyMetadata.nodes[0].metadata;
}
