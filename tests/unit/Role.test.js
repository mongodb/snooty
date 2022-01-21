import React from 'react';
import { render } from '@testing-library/react';

import RoleAbbr from '../../src/components/Roles/Abbr';
import RoleGUILabel from '../../src/components/Roles/GUILabel';
import RoleFile from '../../src/components/Roles/File';

import mockDataGUILabel from './data/Role-guilabel.test.json';
import mockDataFile from './data/Role-file.test.json';
import mockDataAbbr from './data/Role-abbr.test.json';

describe('GUI Label', () => {
  it('correctly renders a "guilabel" role', () => {
    const tree = render(<RoleGUILabel nodeData={mockDataGUILabel} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});

describe('File', () => {
  it('correctly renders a "file" role', () => {
    const tree = render(<RoleFile nodeData={mockDataFile} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});

describe('Abbr', () => {
  it('correctly renders a "Abbr" role', () => {
    const abbr = render(<RoleAbbr nodeData={mockDataAbbr} />);
    expect(abbr.asFragment()).toMatchSnapshot();
  });

  describe('when passed a value with format "ABBR (Full Name Here)"', () => {
    const mockValidAbbr = mockDataAbbr;
    mockValidAbbr.children[0].value = 'Display (Extended)';

    it('parses and strips whitespace from the display value', () => {
      const abbr = render(<RoleAbbr nodeData={mockValidAbbr} />);
      expect(abbr.getByText('Display')).toBeTruthy();
    });
  });
});
