import React from 'react';
import { render } from '@testing-library/react';
import Section from '../../src/components/Section';

// data for this component
import mockData from './data/Section.test.json';

// Mock chatbot context
jest.mock('../../src/context/chatbot-context', () => ({
  useChatbotModal: () => ({
    chatbotClicked: false,
    setChatbotClicked: jest.fn(),
    text: '',
    setText: jest.fn(),
  }),
  ChatbotProvider: ({ children }) => children,
}));

it('renders correctly', () => {
  const tree = render(<Section nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
