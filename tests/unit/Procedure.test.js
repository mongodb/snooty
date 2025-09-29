import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Procedure from '../../src/components/Procedure';

// data for this component
import mockData from './data/Procedure.test.json';

jest.mock('../../src/context/chatbot-context', () => ({
  useChatbotModal: () => ({
    chatbotClicked: false,
    setChatbotClicked: jest.fn(),
    text: '',
    setText: jest.fn(),
  }),
  ChatbotProvider: ({ children }) => children,
}));

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders correctly', () => {
  const tree = render(<Procedure nodeData={mockData.testSteps} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders with "normal" or YAML steps styling', () => {
  // Add styling to mock data
  mockData.testSteps.options = {
    style: 'normal',
  };
  const tree = render(<Procedure nodeData={mockData.testSteps} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders steps nested in include nodes', () => {
  const tree = render(<Procedure nodeData={mockData.nestedSteps} />);
  expect(tree.asFragment()).toMatchSnapshot();
  expect(tree.getAllByText(/Step/)).toHaveLength(7);
});
