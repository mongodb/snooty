import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidenav, SidenavContextProvider, SidenavMobileMenuButton } from '../../src/components/Sidenav';
import { theme } from '../../src/theme/docsTheme';
import { tick, setMatchMedia, setMobile } from '../utils';
import { matchers } from '@emotion/jest';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const setProject = (project) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        project,
      },
    },
  }));
};

const mountSidenav = async () => {
  setProject('test-project');
  const wrapper = render(
    <SidenavContextProvider>
      <SidenavMobileMenuButton />
      <Sidenav page={{}} slug={''} toctree={{ children: [] }} />
    </SidenavContextProvider>
  );
  await tick();
  return wrapper;
};

const resizeWindowWidth = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const findCollapseButton = (wrapper) => {
  return wrapper.getByTestId('side-nav-collapse-toggle');
};

expect.extend(matchers);

describe('Sidenav', () => {
  jest.useFakeTimers();

  it('works on desktop', async () => {
    // Sidenav open by default
    const wrapper = await mountSidenav();
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'true');
    // Close the sidenav
    userEvent.click(findCollapseButton(wrapper));
    await tick();
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'false');
  });

  it('works on tablet', async () => {
    setMatchMedia(theme.screenSize.tablet);

    // Sidenav collapsed by default
    const wrapper = await mountSidenav();
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'false');

    // Open the sidenav
    userEvent.click(findCollapseButton(wrapper));
    await tick();
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'true');
  });

  it('works on mobile', async () => {
    const mobileWidth = 420;
    setMobile();
    resizeWindowWidth(mobileWidth);

    // Sidenav open by default, but is hidden
    const wrapper = await mountSidenav();
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'true');

    // js-dom isn't properly reflecting styled components updating active css across media queries
    // TODO: replace this or otherwise fix if ever a fix is released
    // commented expect statements *should* work, but styles are not rendering properly in this test.
    expect(wrapper.getByTestId('side-nav-container')).toHaveStyleRule('display', 'none', {
      media: `${theme.screenSize.upToSmall}`,
    });

    // Clicking menu button displays Sidenav
    userEvent.click(findCollapseButton(wrapper));
    await tick();
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.getByTestId('side-nav-container')).toBeVisible();

    // Clicking menu button again closes Sidenav
    userEvent.click(findCollapseButton(wrapper));
    await tick();
    expect(wrapper.getByTestId('side-nav-container')).toHaveStyleRule('display', 'none', {
      media: `${theme.screenSize.upToSmall}`,
    });
    expect(findCollapseButton(wrapper)).toHaveAttribute('aria-expanded', 'true');
  });
});
