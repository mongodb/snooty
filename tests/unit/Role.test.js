import React from 'react';
import { shallow } from 'enzyme';

import RoleDoc from '../../src/components/Roles/Doc';
import RoleLink from '../../src/components/Roles/Link';
import RoleRef from '../../src/components/Roles/Ref';
import RoleCode from '../../src/components/Roles/Code';
import RoleProgram from '../../src/components/Roles/Program';

import mockRefDocMapping from './data/index.test.json';
import mockDataDoc from './data/Role-doc.test.json';
import mockDataDocUnlabeled from './data/Role-doc-unlabeled.test.json';
import mockDataRef from './data/Role-ref.test.json';
import mockDataManual from './data/Role-manual.test.json';
import mockDataTerm from './data/Role-term.test.json';
import mockDataBinary from './data/Role-binary.test.json';
import mockDataProgram from './data/Role-program.test.json';

it('renders correctly role "doc"', () => {
  const tree = shallow(<RoleDoc nodeData={mockDataDoc} refDocMapping={mockRefDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "doc" when no link title is included', () => {
  const tree = shallow(<RoleDoc nodeData={mockDataDocUnlabeled} refDocMapping={mockRefDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "manual"', () => {
  const tree = shallow(<RoleLink nodeData={mockDataManual} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "term"', () => {
  const tree = shallow(<RoleLink nodeData={mockDataTerm} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<RoleRef nodeData={mockDataRef} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "binary"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataBinary} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "program"', () => {
  const tree = shallow(<RoleProgram nodeData={mockDataProgram} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly a role "guilabel"', () => {});
