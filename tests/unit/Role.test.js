import React from 'react';
import { shallow, render } from 'enzyme';

import RoleCode from '../../src/components/Roles/Code';
import RoleDoc from '../../src/components/Roles/Doc';
import RoleGUILabel from '../../src/components/Roles/GUILabel';
import RoleManual from '../../src/components/Roles/Manual';
import RoleProgram from '../../src/components/Roles/Program';
import RoleRef from '../../src/components/Roles/Ref';
import RoleTerm from '../../src/components/Roles/Term';

import mockDataAuthrole from './data/Role-authrole.test.json';
import mockDataBinary from './data/Role-binary.test.json';
import mockDataDoc from './data/Role-doc.test.json';
import mockDataDocUnlabeled from './data/Role-doc-unlabeled.test.json';
import mockDataGUILabel from './data/Role-guilabel.test.json';
import mockDataManual from './data/Role-manual.test.json';
import mockDataMethod from './data/Role-method.test.json';
import mockDataOption from './data/Role-option.test.json';
import mockDataProgram from './data/Role-program.test.json';
import mockDataQuery from './data/Role-query.test.json';
import mockDataRef from './data/Role-ref.test.json';
import mockDataSetting from './data/Role-setting.test.json';
import mockDataTerm from './data/Role-term.test.json';
import mockDataUpdate from './data/Role-update.test.json';
import mockRefDocMapping from './data/index.test.json';

it('renders correctly a role "authrole"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataAuthrole} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "binary"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataBinary} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "doc"', () => {
  const tree = render(<RoleDoc nodeData={mockDataDoc} refDocMapping={mockRefDocMapping} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "doc" when no link title is included', () => {
  const tree = render(<RoleDoc nodeData={mockDataDocUnlabeled} refDocMapping={mockRefDocMapping} />);
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

it('renders correctly role "method"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataMethod} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "option"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataOption} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "program"', () => {
  const tree = shallow(<RoleProgram nodeData={mockDataProgram} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly a role "query"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataQuery} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "ref"', () => {
  const tree = shallow(<RoleRef nodeData={mockDataRef} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly a role "setting"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataSetting} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly role "term"', () => {
  const tree = shallow(<RoleTerm nodeData={mockDataTerm} />);
  expect(tree).toMatchSnapshot();
});

it('renders correctly a role "update"', () => {
  const tree = shallow(<RoleCode nodeData={mockDataUpdate} />);
  expect(tree).toMatchSnapshot();
});
