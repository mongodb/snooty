import React from 'react';
import LeafygreenCard from '@leafygreen-ui/card';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';

import RatingView from './views/RatingView';
import CommentView from './views/CommentView';
import QualifiersView from './views/QualifiersView';
import SupportView from './views/SupportView';
import SubmittedView from './views/SubmittedView';

import { useFeedbackState } from './context';

export default function FeedbackCard(props) {
  const { view, abandon } = useFeedbackState();
  const isHidden = view === 'waiting';
  return (
    !isHidden && (
      <Card>
        <Header>
          <CloseButton onClick={abandon} />
        </Header>
        <Content>
          {view === 'rating' && <RatingView />}
          {view === 'qualifiers' && <QualifiersView />}
          {view === 'comment' && <CommentView />}
          {view === 'support' && <SupportView />}
          {view === 'submitted' && <SubmittedView />}
        </Content>
      </Card>
    )
  );
}

const floatingCardStyle = css`
  position: fixed;
  top: 256px;
  right: 80px;
`;
const modalCardStyle = css`
  position: fixed;
  top: 256px;
  right: 80px;
`;

const Card = styled(LeafygreenCard)`
  width: 420px;
  ${floatingCardStyle}
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px;
`;

const Content = styled.div`
  padding: 24px;
  padding-top: 0px;
`;

const CloseButton = props => {
  return (
    <IconButton variant="light" ariaLabel="Close Modal Button" {...props}>
      <Icon glyph="X" />
    </IconButton>
  );
};
