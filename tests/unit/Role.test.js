import React from 'react';
import { shallow, render } from 'enzyme';

import RoleDoc from '../../src/components/Roles/Doc';
import RoleGUILabel from '../../src/components/Roles/GUILabel';
import RoleManual from '../../src/components/Roles/Manual';
import RoleProgram from '../../src/components/Roles/Program';
import RoleRef from '../../src/components/Roles/Ref';
import RoleTerm from '../../src/components/Roles/Term';

import mockDataDoc from './data/Role-doc.test.json';
import mockDataDocUnlabeled from './data/Role-doc-unlabeled.test.json';
import mockDataGUILabel from './data/Role-guilabel.test.json';
import mockDataManual from './data/Role-manual.test.json';
import mockDataProgram from './data/Role-program.test.json';
import mockDataRef from './data/Role-ref.test.json';
import mockDataTerm from './data/Role-term.test.json';

it('renders correctly role "doc"', () => {
  const tree = render(<RoleDoc nodeData={mockDataDoc} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "doc" when no link title is included', () => {
  const tree = render(<RoleDoc nodeData={mockDataDocUnlabeled} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly a role "guilabel"', () => {
  const tree = shallow(<RoleGUILabel nodeData={mockDataGUILabel} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "manual"', () => {
  const tree = shallow(<RoleManual nodeData={mockDataManual} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "program"', () => {
  const tree = shallow(<RoleProgram nodeData={mockDataProgram} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<RoleRef nodeData={mockDataRef} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "term"', () => {
  const tree = shallow(<RoleTerm nodeData={mockDataTerm} />);
  expect(tree).toMatchSnapshot();
});
