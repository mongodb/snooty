import React from 'react';
import { render } from '@testing-library/react';
import QuizWidget from '../../src/components/Widgets/QuizWidget/QuizWidget';

// data for this component
import { completeQuiz, noQuestion } from './data/QuizWidget.test.json';

const siteUrl = 'https://docs.mongodb.com';
const project = 'cloud-docs';

const timestamp = 1466424490000;
const mockDate = new Date(timestamp);

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ siteUrl }),
}));

jest.mock(`../../src/utils/use-snooty-metadata`, () => {
  return () => ({
    project,
  });
});

describe('quiz widget snapshots', () => {
  const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  Date.now = jest.fn(() => timestamp);

  it('renders quiz widget correctly', () => {
    const tree = render(<QuizWidget nodeData={completeQuiz} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('doesnt render quiz widget without a specified question', () => {
    const tree = render(<QuizWidget nodeData={noQuestion} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  afterAll(() => {
    spy.mockRestore();
  });
});
