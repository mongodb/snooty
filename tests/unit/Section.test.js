import React from 'react';
import { render } from '@testing-library/react';
import Section from '../../src/components/Section';

// data for this component
import mockData from './data/Section.test.json';

jest.mock('../../src/context/chatbot-context', () => ({
  useChatbot: () => ({
    openChatbotWithText: jest.fn(),
  }),
}));

it('renders correctly', () => {
  const tree = render(<Section nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
