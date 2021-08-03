import React from 'react';
import LeafygreenCard from '@leafygreen-ui/card';
import styled from '@emotion/styled';

import CloseButton from './components/CloseButton';
import { useFeedbackState } from './context';

export default function FeedbackCard({ isOpen, children }) {
  const { abandon } = useFeedbackState();
  return <div></div>
