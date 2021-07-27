import React from 'react';
import { shallow } from 'enzyme';
import QuizWidget from '../../src/components/QuizWidget';

// data for this component
import { completeQuiz, noQuestion } from './data/QuizWidget.test.json';

it('renders quiz widget correctly', () => {
  const tree = shallow(<QuizWidget nodeData={completeQuiz} />);
  expect(tree).toMatchSnapshot();
});

it('doesnt render quiz widget without a specified question', () => {
  const tree = shallow(<QuizWidget nodeData={noQuestion} />);
  expect(tree).toMatchSnapshot();
});
