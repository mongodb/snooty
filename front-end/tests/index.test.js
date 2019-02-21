import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Index from '../src/templates/index';

// data for this component
import mockData from '../tests/data/index.test.json';

it('renders correctly', () => {
  const tree = renderer
    .create(<Index pageContext={ { __refDocMapping: mockData } } />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
