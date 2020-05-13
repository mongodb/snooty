import React from 'react';
import Button from '@leafygreen-ui/button';
import { useFeedbackState } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Heading, Subheading } from '../components/view-components';

export default function SubmittedView(props) {
  const { abandon } = useFeedbackState();
  const { isSmallScreen } = useScreenSize();
  return (
    <Layout>
      <Heading>We appreciate your feedback.</Heading>
      <Subheading>We're working hard to improve the MongoDB Documentation.</Subheading>
      <Subheading>
        <span>For additional support, explore the </span>
        <a href="https://groups.google.com/forum/#!forum/mongodb-user">MongoDB discussion forum.</a>
      </Subheading>
      {isSmallScreen && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Layout>
  );
}
