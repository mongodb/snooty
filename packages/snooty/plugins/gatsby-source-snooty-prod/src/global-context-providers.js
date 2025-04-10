import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { MetadataProvider } from '../../../src/utils/use-snooty-metadata';

export function GlobalProviders({ element }) {
  const {
    snootyMetadata: { metadata },
  } = useStaticQuery(graphql`
    {
      snootyMetadata {
        metadata
      }
    }
  `);

  return <MetadataProvider metadata={metadata}>{element}</MetadataProvider>;
}
