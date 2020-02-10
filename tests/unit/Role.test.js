import React from 'react';
import { render } from 'enzyme';

import RoleDoc from '../../src/components/Roles/Doc';
import RoleGUILabel from '../../src/components/Roles/GUILabel';
import RoleFile from '../../src/components/Roles/File';

import mockDataDoc from './data/Role-doc.test.json';
import mockDataGUILabel from './data/Role-guilabel.test.json';
import mockDataFile from './data/Role-file.test.json';
import slugTitleMapping from './data/ecosystem/slugTitleMapping.json';

it('correctly renders a "doc" role', () => {
  const tree = render(<RoleDoc nodeData={mockDataDoc} slugTitleMapping={slugTitleMapping} />);
  expect(tree).toMatchSnapshot();
});

it('correctly renders a "guilabel" role', () => {
  const tree = render(<RoleGUILabel nodeData={mockDataGUILabel} />);
  expect(tree).toMatchSnapshot();
});

it('correctly renders a "file" role', () => {
  const tree = render(<RoleFile nodeData={mockDataFile} />);
  expect(tree).toMatchSnapshot();
});
