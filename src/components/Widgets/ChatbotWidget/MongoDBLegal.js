import { Body, Link } from '@leafygreen-ui/typography';

const MongoDbLegalDisclosure = () => {
  const TermsOfUse = () => (
    <Link hideExternalIcon href="https://www.mongodb.com/legal/terms-of-use">
      Terms of Use
    </Link>
  );
  const AcceptableUsePolicy = () => (
    <Link hideExternalIcon href="https://www.mongodb.com/legal/acceptable-use-policy">
      Acceptable Use Policy
    </Link>
  );
  const AtlasVectorSearch = () => (
    <Link hideExternalIcon href="https://www.mongodb.com/products/platform/atlas-vector-search">
      Atlas Vector Search
    </Link>
  );

  return (
    <Body>
      This is a generative AI chatbot powered by <AtlasVectorSearch />.
      By interacting with it, you agree to MongoDB's <TermsOfUse /> and{' '}
      <AcceptableUsePolicy />.
    </Body>
  );
};

export default MongoDbLegalDisclosure;
