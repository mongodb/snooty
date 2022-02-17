import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toctree from '../../src/components/Sidenav/Toctree';
import mockData from './data/Toctree.test.json';
import { tick } from '../utils';

// mockData is a minimal toctree, based off of Realm's toctree:
// /get-started (drawer)
//   /get-started/introduction-mobile
//   /get-started/introduction-backend
// /sdk
//   /sdk/android
//     /sdk/android/fundamentals (drawer)
//       /sdk/android/fundamentals/async-api
//   /sdk/ios

const mountToctree = (slug) => {
  return render(<Toctree slug={slug} toctree={mockData?.toctree} />);
};

describe('Toctree', () => {
  jest.useFakeTimers();

  it('renders parent nodes', () => {
    const wrapper = mountToctree('/');
    expect(wrapper.getByText('Get Started')).toBeTruthy();
    expect(wrapper.getByText('Realm Database SDKs')).toBeTruthy();
  });

  it('clicking on a drawer shows nested children', async () => {
    const wrapper = mountToctree('/');
    const parentDrawer = wrapper.queryAllByRole('button');
    expect(parentDrawer).toBeTruthy();
    userEvent.click(parentDrawer[0]);
    await tick();
    expect(wrapper.getByText('Introduction for Mobile Developers')).toBeTruthy();
  });

  it('clicking on a drawer changes carat arrow', async () => {
    const wrapper = mountToctree('/');
    const parentDrawer = wrapper.queryAllByRole('button');
    expect(wrapper.getAllByRole('img')[0]).toHaveAttribute('aria-label', 'Caret Right Icon');
    userEvent.click(parentDrawer[0]);
    await tick();
    expect(wrapper.getAllByRole('img')[0]).toHaveAttribute('aria-label', 'Caret Down Icon');
  });

  it('correct item set as active based off current page', () => {
    const wrapper = render(<Toctree slug={'/'} toctree={mockData?.toctree} />);
    const testActivePage = (testPage, testText) => {
      wrapper.rerender(<Toctree slug={testPage} toctree={mockData?.toctree} />);
      expect(wrapper.getByText(testText).closest('a')).toHaveAttribute('aria-current', 'page');
      expect(wrapper.getByText(testText).closest('a')).toHaveAttribute('href', `/${testPage}/`);
    };

    testActivePage('sdk/android/fundamentals/async-api', 'Asynchronous API');
    testActivePage('sdk/ios', 'iOS SDK');
  });
});
