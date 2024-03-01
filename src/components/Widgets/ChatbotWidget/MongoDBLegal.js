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

  return (
    <Body>
      This is a generative AI chatbot. By interacting with it, you agree to MongoDB's <TermsOfUse /> and{' '}
      <AcceptableUsePolicy />.
    </Body>
  );
};

export default MongoDbLegalDisclosure;
