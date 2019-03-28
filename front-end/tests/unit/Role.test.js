import React from 'react';
import { shallow } from 'enzyme';

import RoleLink from '../../src/components/Roles/Link';
import RoleRef from '../../src/components/Roles/Ref';
import RoleCode from '../../src/components/Roles/Code';
import RoleProgram from '../../src/components/Roles/Program';

import { REF_TARGETS } from '../../src/constants';
import mockDataDoc from './data/Role-doc.test.json';
import mockDataRef from './data/Role-ref.test.json';
import mockDataManual from './data/Role-manual.test.json';
import mockDataTerm from './data/Role-term.test.json';
import mockDataBinary from './data/Role-binary.test.json';
import mockDataProgram from './data/Role-program.test.json';

const refDocMapping = { REF_TARGETS };

it('renders correctly role "doc"', () => {
  const tree = shallow(<RoleLink nodeData={mockDataDoc} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "manual"', () => {
  const tree = shallow(<RoleLink nodeData={mockDataManual} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "term"', () => {
  const tree = shallow(<RoleLink nodeData={mockDataTerm} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<RoleRef nodeData={mockDataRef} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "binary"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataBinary} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "program"', () => {
  const tree = shallow(<RoleProgram nodeData={mockDataProgram} refDocMapping={refDocMapping} />);
  expect(tree).toMatchSnapshot();
});
