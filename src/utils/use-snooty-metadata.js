import { useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';

export default function useSnootyMetadata() {
  const location = useLocation();
  const data = useStaticQuery(graphql`
    query Metadata {
      allSnootyMetadata {
        nodes {
          metadata
          branch
        }
      }
    }
  `);

  // If we're in preview mode, we build the pages of each branch of the site within
  // its own namespace so each author can preview their own pages e.g.
  // /BRANCH--branch1/doc-path
  // /BRANCH--branch2/doc-path
  //
  // So to get the metadata for each namespaced site, we get the branch from the pathname
  // and then find the branch.
  const firstPathSegment = location.pathname.split(`/`).slice(1, 2)[0];
  if (process.env.GATSBY_IS_PREVIEW === `true` && firstPathSegment.startsWith(`BRANCH--`)) {
    const branch = firstPathSegment.split(`--`)[1];
    return data.allSnootyMetadata.nodes.find((node) => node.branch === branch).metadata;
  } else {
    return data.allSnootyMetadata.nodes[0].metadata;
  }
}
