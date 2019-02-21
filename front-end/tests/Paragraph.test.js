import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Paragraph from '../src/components/Paragraph';

// data for this component
import mockData from '../tests/data/Paragraph.test.json';

it('renders correctly', () => {
  const tree = renderer
    .create(<Paragraph nodeData={ mockData } />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
