/**
 * Duplicated version of the PoweredByAtlasVectorSearch component from
 * mongodb-chatbot-ui
 *
 * We define our own version here because we faced a rendering issue
 * when importing the original component from mongodb-chatbot-ui.
 *   (The issue is that the open modal renders with opacity: 0)
 * This seems to be a side effect of lazy loading the component.
 * We have to lazy load the component because mongodb-chatbot-ui
 * does not currently support SSR.
 */

import { Body, Link } from '@leafygreen-ui/typography';
import { cx } from '@leafygreen-ui/emotion';

const url = 'https://www.mongodb.com/products/platform/atlas-vector-search?tck=mongodb_ai_chatbot';
const VectorSearchLink = ({ children }) => (
  <Link href={url} hideExternalIcon>
    {children}
  </Link>
);

export function PoweredByAtlasVectorSearch({ className, linkStyle = 'learnMore' }) {
  if (linkStyle === 'learnMore') {
    return (
      <Body className={cx(className)}>
        Powered by Atlas Vector Search. <VectorSearchLink>Learn More.</VectorSearchLink>
      </Body>
    );
  }
  if (linkStyle === 'text') {
    return (
      <Body className={cx(className)}>
        Powered by <VectorSearchLink>Atlas Vector Search</VectorSearchLink>
      </Body>
    );
  }
  console.warn("Invalid linkStyle prop. Must be 'learnMore' (default) or 'text'.");
  return <></>;
}
