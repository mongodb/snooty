import { GlobalProviders } from './src/global-context-providers';

console.log('gatsby-source-snooty-prod gatsby-browser')

export function wrapRootElement({ element }) {
  return <GlobalProviders element={element} />;
}
