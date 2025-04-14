/**
 * Duplicated version of the MongoDbLegalDisclosure component from
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

const DOCS_AI_TCK = 'mongodb_ai_chatbot';

export function MongoDbLegalDisclosure() {
  const TermsOfUse = () => (
    <Link hideExternalIcon href={`https://www.mongodb.com/legal/terms-of-use?tck=${DOCS_AI_TCK}`}>
      Terms of Use
    </Link>
  );
  const AcceptableUsePolicy = () => (
    <Link hideExternalIcon href={`https://www.mongodb.com/legal/acceptable-use-policy?tck=${DOCS_AI_TCK}`}>
      Acceptable Use Policy
    </Link>
  );

  return (
    <Body baseFontSize={13}>
      This is a generative AI chatbot. By interacting with it, you agree to MongoDB's <TermsOfUse /> and{' '}
      <AcceptableUsePolicy />.
    </Body>
  );
}
