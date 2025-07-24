import React from 'react';
import Button from '@leafygreen-ui/button';
import styled from '@emotion/styled';
import { Link, Subtitle } from '@leafygreen-ui/typography';
import { useFeedbackContext } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Subheading } from '../components/view-components';
import StarRating from '../components/StarRating';
import { theme } from '../../../../theme/docsTheme';
import { SUBMITTED_VIEW_RESOURCE_LINKS, SUBMITTED_VIEW_SUPPORT_LINK, SUBMITTED_VIEW_TEXT } from '../constants';

const SupportCase = styled.div`
  margin-top: ${theme.size.default};
`;

const StyledHeading = styled(Subtitle)`
  margin-top: 30px;
  margin-bottom: ${theme.size.default};
  text-align: center;
`;

const Container = styled(Layout)`
  padding: 0 ${theme.size.default};
`;

const SubmittedView = () => {
  const { abandon } = useFeedbackContext();
  const { isMobile } = useScreenSize();
  const { selectedRating } = useFeedbackContext();
  const shouldShowSupportLink = selectedRating ? selectedRating <= 3 : true;

  return (
    <Container>
      <StyledHeading>{SUBMITTED_VIEW_TEXT.HEADING}</StyledHeading>
      <StarRating editable={false} />
      <Subheading>{SUBMITTED_VIEW_TEXT.SUB_HEADING}</Subheading>
      <Subheading>
        <span>{SUBMITTED_VIEW_TEXT.RESOURCES_CTA}</span>
        {SUBMITTED_VIEW_RESOURCE_LINKS.map(({ text, href }, index) => (
          <React.Fragment key={index}>
            <br />
            <Link href={href} baseFontSize={13} hideExternalIcon={true}>
              {text}
            </Link>
          </React.Fragment>
        ))}
        {shouldShowSupportLink && (
          <SupportCase>
            {`${SUBMITTED_VIEW_TEXT.SUPPORT_CTA} `}
            <Link href={SUBMITTED_VIEW_SUPPORT_LINK.href} baseFontSize={13} hideExternalIcon={true}>
              {SUBMITTED_VIEW_SUPPORT_LINK.text}
            </Link>
          </SupportCase>
        )}
      </Subheading>
      {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </Container>
  );
};

export default SubmittedView;
