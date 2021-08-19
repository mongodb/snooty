import React from 'react';
import Button from '@leafygreen-ui/button';
import { Body } from '@leafygreen-ui/typography';
import { uiColors } from '@leafygreen-ui/palette';
import { useFeedbackState } from '../context';
import useScreenSize from '../../../../hooks/useScreenSize';
import { Layout, Heading, Subheading } from '../components/view-components';
import styled from '@emotion/styled';

const StyledSubmitHeader = styled(Body)`
  margin-top: 10px !important;
  text-align: left;
  font-size: 18px;
`;
const StyledLayout = styled(Layout)`
  align-items: unset !important;
`;

const SubmitBody = styled(Body)`
  color: ${uiColors.gray.dark1};
  padding-top: 8px;
`;

const SubmitLink = styled('a')`
  font-size: 16px !important;
`;

const ResourceLinks = styled('div')`
  padding-top: 8px;
  white-space: pre-line;
`;

export default function SubmittedView(props) {
  const { abandon } = useFeedbackState();
  const { isMobile } = useScreenSize();
  const newline = `\n`;
  return (
    <StyledLayout>
      <StyledSubmitHeader weight="medium">Thanks for your help!</StyledSubmitHeader>
      <SubmitBody>Your input improves MongoDB's documentation.</SubmitBody>
      <Subheading>
        <SubmitBody>To learn more about MongoDB: </SubmitBody>
        <ResourceLinks>
          <SubmitLink href="https://developer.mongodb.com/community/forums/">
            Visit MongoDB University. {newline}{' '}
          </SubmitLink>
          <SubmitLink href="https://developer.mongodb.com/community/forums/">Visit the MongoDB Community.</SubmitLink>
        </ResourceLinks>
      </Subheading>
      {isMobile && <Button onClick={() => abandon()}>Return to the Documentation</Button>}
    </StyledLayout>
  );
}
