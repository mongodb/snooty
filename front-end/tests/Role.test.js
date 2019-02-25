import React from 'react';
import { shallow } from 'enzyme';
import Role from '../src/components/Role';

// data for this component
import mockData_doc from './data/Role-doc.test.json';
import mockData_ref from './data/Role-ref.test.json';

it('renders correctly role "doc"', () => {
  const tree = shallow(<Role nodeData={ mockData_doc } />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<Role nodeData={ mockData_ref } />);
  expect(tree).toMatchSnapshot();
});