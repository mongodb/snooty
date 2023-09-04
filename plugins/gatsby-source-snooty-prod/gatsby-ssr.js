import { GlobalProviders } from './src/global-context-providers';

export function wrapRootElement({ element }) {
  return <GlobalProviders element={element} />;
}
