import React from 'react';
import { render, act } from '@testing-library/react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { DarkModeContext } from '../../src/context/dark-mode-context';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import * as MediaHooks from '../../src/hooks/use-media';
import DarkModeDropdown from '../../src/components/ActionBar/DarkModeDropdown';

import { setDesktop } from '../utils';

let darkModePref = 'light-theme';

const setDarkModePref = jest.fn((value) => {
  darkModePref = value;
});

// mock useSnootyMetadata
jest.spyOn(snootyMetadata, 'default').mockImplementation(() => ({
  project: 'landing',
}));

// mock useMedia
jest.spyOn(MediaHooks, 'default').mockImplementation(() => ({}));

// mock window.localStorage
const storage = {};
jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
  storage[key] = value;
});

const mountDarkModeDropdown = () => {
  return render(
    <DarkModeContext.Provider value={{ setDarkModePref, darkModePref }}>
      <LeafyGreenProvider baseFontSize={16} darkMode={darkModePref === 'dark-theme'}>
        <DarkModeDropdown />
      </LeafyGreenProvider>
    </DarkModeContext.Provider>
  );
};

describe('DarkMode Dropdown component', () => {
  beforeEach(setDesktop);

  it('renders dark mode dropdown', async () => {
    // first snapshot of closed menu
    const elm = mountDarkModeDropdown();
    expect(elm.asFragment()).toMatchSnapshot();
    const button = await elm.findByLabelText('Dark Mode Menu');
    await act(async () => {
      button.click();
    });
    // second snapshot of open menu
    expect(elm.asFragment()).toMatchSnapshot();
  });

  // test it changes to system and dark mode
  it('updates dark mode when selecting a different option', async () => {
    const elm = mountDarkModeDropdown();
    const button = await elm.findByLabelText('Dark Mode Menu');
    await act(async () => {
      button.click();
    });
    const darkModeSelections = await elm.findAllByRole('menuitem');
    await act(async () => {
      darkModeSelections[1].click();
    });
    expect(darkModePref).toBe('dark-theme');
    const darkElm = mountDarkModeDropdown();
    expect(darkElm.asFragment()).toMatchSnapshot();
  });
});
