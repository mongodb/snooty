import React from 'react';
import { render, shallow } from 'enzyme';

import RoleAbbr from '../../src/components/Roles/Abbr';
import RoleGUILabel from '../../src/components/Roles/GUILabel';
import RoleFile from '../../src/components/Roles/File';

import mockDataGUILabel from './data/Role-guilabel.test.json';
import mockDataFile from './data/Role-file.test.json';
import mockDataAbbr from './data/Role-abbr.test.json';

describe('GUI Label', () => {
  it('correctly renders a "guilabel" role', () => {
    const tree = render(<RoleGUILabel nodeData={mockDataGUILabel} />);
    expect(tree).toMatchSnapshot();
  });
});

describe('File', () => {
  it('correctly renders a "file" role', () => {
    const tree = render(<RoleFile nodeData={mockDataFile} />);
    expect(tree).toMatchSnapshot();
  });
});

describe('Abbr', () => {
  it('correctly renders a "Abbr" role', () => {
    const abbr = render(<RoleAbbr nodeData={mockDataAbbr} />);
    expect(abbr).toMatchSnapshot();
  });

  describe('when passed a value with format "ABBR (Full Name Here)"', () => {
    const mockValidAbbr = mockDataAbbr;
    mockValidAbbr.children[0].value = 'Display (Extended)';

    it('parses and strips whitespace from the display value', () => {
      const abbr = shallow(<RoleAbbr nodeData={mockValidAbbr} />);
      expect(abbr.text()).toBe('Display');
    });
  });
});
