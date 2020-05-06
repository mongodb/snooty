import React from 'react';
import { render } from 'enzyme';

import RoleGUILabel from '../../src/components/Roles/GUILabel';
import RoleFile from '../../src/components/Roles/File';

import mockDataGUILabel from './data/Role-guilabel.test.json';
import mockDataFile from './data/Role-file.test.json';

it('correctly renders a "guilabel" role', () => {
  const tree = render(<RoleGUILabel nodeData={mockDataGUILabel} />);
  expect(tree).toMatchSnapshot();
});

it('correctly renders a "file" role', () => {
  const tree = render(<RoleFile nodeData={mockDataFile} />);
  expect(tree).toMatchSnapshot();
});
