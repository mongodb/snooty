const { useStaticQuery, graphql } = require('gatsby');

export function useVersionsToml() {
  const data = useStaticQuery(
    graphql`
      query versionsData {
        versionsData {
          versionsList
        }
      }
    `
  );
  return data.versionsData.versionsList.repo ?? [];
}
