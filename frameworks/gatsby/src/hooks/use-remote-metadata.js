import { useStaticQuery, graphql } from 'gatsby';

// Return the remote metadata node
export const useRemoteMetadata = () => {
  const data = useStaticQuery(
    graphql`
      query RemoteMetadata {
        allRemoteMetadata {
          nodes {
            remoteMetadata
          }
        }
      }
    `
  );
  return data.allRemoteMetadata.nodes[0]?.remoteMetadata ?? {};
};
