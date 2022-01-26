import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reachRouter from '@gatsbyjs/reach-router';
import Operation from '../../src/components/Operation';

// data for this component
import { onlyDescription, neitherSummaryNorDescription, bothSummaryAndDescription } from './data/Operation.test.json';

const shallowOperation = (data) =>
  render(
    <reachRouter.LocationProvider>
      <Operation nodeData={data} />
    </reachRouter.LocationProvider>
  );

const mockLocation = (hash) => jest.spyOn(reachRouter, 'useLocation').mockImplementation(() => ({ hash }));

describe('when rendering all fields', () => {
  beforeAll(() => {
    mockLocation(null);
  });

  it('renders correctly ', () => {
    const wrapper = shallowOperation(bothSummaryAndDescription);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  describe('when the component is loaded', () => {
    it('does not expand the card on load', () => {
      const wrapper = shallowOperation(bothSummaryAndDescription);
      expect(wrapper.queryAllByText('Description').length).toBe(0);
    });

    describe('when the expand button is clicked', () => {
      beforeAll(() => {
        window.history.pushState = jest.fn();
      });

      it('the card expands', () => {
        const wrapper = shallowOperation(bothSummaryAndDescription);
        userEvent.click(wrapper.getByLabelText('Show operation details'));
        expect(wrapper.queryAllByText('Description')).toBeTruthy();
      });

      it('appends the hash to the URL', () => {
        const wrapper = shallowOperation(bothSummaryAndDescription);
        userEvent.click(wrapper.getByLabelText('Show operation details'));
        expect(window.history.pushState).toBeCalledWith({ href: 'get-/auth/profile' }, '', '#get-/auth/profile');
      });
    });
  });
});

describe('when no summary is present', () => {
  let wrapper;

  beforeAll(() => {
    mockLocation(null);
  });

  it('renders correctly ', () => {
    wrapper = shallowOperation(onlyDescription);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('does not show the "Description" section', () => {
    wrapper = shallowOperation(onlyDescription);
    expect(wrapper.queryAllByText('Description')).toBeTruthy();
  });
});

describe('when no summary or description is present', () => {
  beforeAll(() => {
    mockLocation(null);
  });

  it('renders correctly ', () => {
    let wrapper = shallowOperation(neitherSummaryNorDescription);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});

describe('when a page is loaded with its hash set', () => {
  beforeAll(() => {
    mockLocation('#get-/auth/providers');
  });

  it('automatically expands the card', () => {
    let wrapper = shallowOperation(onlyDescription);
    expect(wrapper.queryAllByText('Details')).toBeTruthy();
  });
});
