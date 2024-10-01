import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocation } from '../utils/mock-location';
import Toctree from '../../src/components/Sidenav/Toctree';
import { tick } from '../utils';
import mockData from './data/Toctree.test.json';

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

beforeAll(() => {
  mockLocation(null, `/`);
});

describe('Toctree', () => {
  jest.useFakeTimers();

  it('renders parent nodes', () => {
    const wrapper = mountToctree('/');
    expect(wrapper.getByText('Get Started')).toBeTruthy();
    expect(wrapper.getByText('Realm Database SDKs')).toBeTruthy();
  });

  it('clicking on a drawer twice expands and collapses nested children', async () => {
    const wrapper = mountToctree('/');
    const parentDrawer = wrapper.getByText('Realm Database SDKs');
    expect(parentDrawer).toBeTruthy();
    expect(wrapper.queryByText('Android SDK')).toBeFalsy();
    userEvent.click(wrapper.getByText('Realm Database SDKs'));
    await tick();
    expect(wrapper.queryByText('Android SDK')).toBeTruthy();
    userEvent.click(wrapper.getByText('Realm Database SDKs'));
    await tick();
    expect(wrapper.queryByText('Android SDK')).toBeFalsy();
  });

  it('clicking on a drawer changes carat arrow', async () => {
    const wrapper = mountToctree('/');
    const parentDrawer = wrapper.getByText('Get Started');
    expect(wrapper.getAllByRole('img')[0]).toHaveAttribute('aria-label', 'Caret Right Icon');
    userEvent.click(parentDrawer);
    await tick();
    expect(wrapper.getAllByRole('img')[0]).toHaveAttribute('aria-label', 'Caret Down Icon');
  });

  it('correct item set as active based off current page', () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
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
