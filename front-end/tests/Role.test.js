import React from 'react';
import { shallow } from 'enzyme';
import Role from '../src/components/Role';

// data for this component
import mockDataDoc from './data/Role-doc.test.json';
import mockDataRef from './data/Role-ref.test.json';

it('renders correctly role "doc"', () => {
  const tree = shallow(<Role nodeData={ mockDataDoc } />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<Role nodeData={ mockDataRef } />);
  expect(tree).toMatchSnapshot();
});