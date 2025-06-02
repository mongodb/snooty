import { useStaticQuery, graphql } from 'gatsby';
import { RemoteMetadata } from '../types/data';

type RemoteMetadataQueryResult = {
  allRemoteMetadata: {
    nodes: {
      remoteMetadata: RemoteMetadata;
    }[];
  };
};

// Return the remote metadata node
export const useRemoteMetadata = () => {
  const data = useStaticQuery<RemoteMetadataQueryResult>(
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
