import { useStaticQuery, graphql } from 'gatsby';

export const useUmbrellaMetadata = () => {
  const data = useStaticQuery(graphql`
    query UmbrellaMetadata {
      snootyMetadata(isUmbrella: { eq: true }) {
        metadata
      }
    }
  `);

  return data.snootyMetadata?.metadata || {};
};
