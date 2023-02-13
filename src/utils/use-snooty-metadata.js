import { useStaticQuery, graphql } from 'gatsby';

export default function useSnootyMetadata() {
  const data = useStaticQuery(graphql`
    query Metadata {
      snootyMetadata(isRoot: { eq: true }) {
        metadata
      }
    }
  `);

  return data.snootyMetadata.metadata;
}
