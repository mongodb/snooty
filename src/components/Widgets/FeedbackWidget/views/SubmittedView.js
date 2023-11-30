import React from 'react';
import Button from '@leafygreen-ui/button';
import styled from '@emotion/styled';
import { Subtitle } from '@leafygreen-ui/typography';
import { useFeedbackContext } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Subheading } from '../components/view-components';
import StarRating from '../components/StarRating';

const RESOURCE_LINKS = [
  { text: 'MongoDB Developer Community Forums', href: 'https://www.mongodb.com/community/forums/' },
  { text: 'MongoDB Developer Center', href: 'https://www.mongodb.com/developer/' },
  { text: 'MongoDB University', href: 'https://learn.mongodb.com/' },
];

const SUPPORT_LINK =
  'https://support.mongodb.com/?_ga=2.191926057.2087449804.1701109748-1659791399.1655906873&_gac=1.114903413.1698074435.CjwKCAjws9ipBhB1EiwAccEi1AOuCPf5YadKdTucTL0245YGXrgMbNUsNrZLHXWf-WX73dnW1DOzZBoCR-QQAvD_BwE';

const SupportCase = styled.div`
  margin-top: 16px;
`;

const StyledHeading = styled(Subtitle)`
  margin-top: 30px;
  margin-bottom: 16px;
  text-align: center;
`;

const SubmittedView = () => {
  const { abandon } = useFeedbackContext();
  const { isMobile } = useScreenSize();
  const { selectedRating } = useFeedbackContext();
  const isSentimentNegative = selectedRating <= 3;

  return (
    <Layout>
      <StyledHeading>Thank you for your feedback!</StyledHeading>
      <StarRating editable={false} />
      <Subheading>Your input improves MongoDB's Documentation.</Subheading>
      <Subheading>
        <span>Looking for more resources? </span>
        {RESOURCE_LINKS.map(({ text, href }) => (
          <>
            <a href={href}>{text}</a>
            <br />
          </>
        ))}
        {isSentimentNegative && (
          <SupportCase>
            Have a support contact?
            <a href={SUPPORT_LINK}>Create a Support Case</a>
          </SupportCase>
        )}
      </Subheading>
      {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Layout>
  );
};

export default SubmittedView;
