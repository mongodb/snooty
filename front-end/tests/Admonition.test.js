import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Admonition from '../src/components/Admonition';

// data for this component
import mockData from '../tests/data/Admonition.test.json';

it('renders correctly', () => {
  const tree = renderer
    .create(<Admonition nodeData={ mockData } />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});