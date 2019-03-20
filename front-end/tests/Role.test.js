import React from 'react';
import { shallow } from 'enzyme';

// the different roles
import RoleLink from '../src/components/Roles/Link';
import RoleRef from '../src/components/Roles/Ref';

// data for this component
import { REF_TARGETS } from '../src/constants';
import mockDataDoc from './data/Role-doc.test.json';
import mockDataRef from './data/Role-ref.test.json';

const refDocMapping = { REF_TARGETS };

it('renders correctly role "doc"', () => {
  const tree = shallow(<RoleLink nodeData={mockDataDoc} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<RoleRef nodeData={mockDataRef} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});