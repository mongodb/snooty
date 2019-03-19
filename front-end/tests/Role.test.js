import React from 'react';
import { shallow } from 'enzyme';
import Role from '../src/components/Role';

// data for this component
import { REF_TARGETS } from '../src/constants';
import mockDataDoc from './data/Role-doc.test.json';
import mockDataRef from './data/Role-ref.test.json';

const refDocMapping = { REF_TARGETS };

it('renders correctly role "doc"', () => {
  const tree = shallow(<Role nodeData={mockDataDoc} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<Role nodeData={mockDataRef} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});
