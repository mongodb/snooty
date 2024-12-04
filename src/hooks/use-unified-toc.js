const { useStaticQuery, graphql } = require('gatsby');

export function useUnifiedToc() {
  const data = useStaticQuery(
    graphql`
      query TocTree {
        toc {
          id
          tocTree
        }
      }
    `
  );
  return data.toc.tocTree.toc ?? {};
}
