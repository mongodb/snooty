import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import Procedure from '../../src/components/Procedure';
import { AncestorComponentContextProvider } from '../../src/context/ancestor-components-context';
import { HeadingContextProvider } from '../../src/context/heading-context';

// data for this component
import mockData from './data/Procedure.test.json';

jest.mock('mongodb-chatbot-ui', () => ({
  __esModule: true,
  useChatbotContext: () => ({
    openChat: jest.fn(),
    setInputText: jest.fn(),
    handleSubmit: jest.fn(),
  }),
  default: () => null,
}));

// Mock ComponentFactory to return simple content for testing
jest.mock('../../src/components/ComponentFactory', () => {
  return function ComponentFactory({ nodeData }) {
    if (!nodeData) return null;
    return 'Mock Content';
  };
});

const renderWithContexts = (component) => {
  return render(
    <AncestorComponentContextProvider component="document">
      <HeadingContextProvider>{component}</HeadingContextProvider>
    </AncestorComponentContextProvider>
  );
};

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders correctly', () => {
  const tree = renderWithContexts(<Procedure nodeData={mockData.testSteps} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders with "normal" or YAML steps styling', () => {
  // Add styling to mock data
  mockData.testSteps.options = {
    style: 'normal',
  };
  const tree = renderWithContexts(<Procedure nodeData={mockData.testSteps} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders steps nested in include nodes', () => {
  const tree = renderWithContexts(<Procedure nodeData={mockData.nestedSteps} />);
  expect(tree.asFragment()).toMatchSnapshot();
  expect(tree.getAllByText(/^[1-7]$/)).toHaveLength(7);
});
