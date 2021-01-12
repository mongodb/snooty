import React from 'react';
import { mount, shallow } from 'enzyme';
import * as reachRouter from '@reach/router';
import Operation from '../../src/components/Operation';

// data for this component
import { onlyDescription, neitherSummaryNorDescription, bothSummaryAndDescription } from './data/Operation.test.json';

const shallowOperation = data => shallow(<Operation nodeData={data} />);
const mountOperation = data => mount(<Operation nodeData={data} />);

const mockLocation = hash => jest.spyOn(reachRouter, 'useLocation').mockImplementation(() => ({ hash }));

describe('when rendering all fields', () => {
  let wrapper;

  beforeAll(() => {
    mockLocation(null);
  });

  it('renders correctly ', () => {
    wrapper = shallowOperation(bothSummaryAndDescription);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when the component is loaded', () => {
    beforeAll(() => {
      wrapper = mountOperation(bothSummaryAndDescription);
    });

    it('does not expand the card on load', () => {
      expect(wrapper.exists('Details')).toBe(false);
    });

    describe('when the expand button is clicked', () => {
      beforeAll(() => {
        window.history.pushState = jest.fn();
      });

      it('the card expands', () => {
        const button = wrapper.find('button');
        button.simulate('click');
        expect(wrapper.exists('Details')).toBe(true);
      });

      it('appends the hash to the URL', () => {
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
    expect(wrapper).toMatchSnapshot();
  });

  it('does not show the "Description" section', () => {
    wrapper = mountOperation(onlyDescription);
    expect(wrapper.exists('Description')).toBe(true);
  });
});

describe('when no summary or description is present', () => {
  beforeAll(() => {
    mockLocation(null);
  });

  it('renders correctly ', () => {
    let wrapper = shallowOperation(neitherSummaryNorDescription);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('when a page is loaded with its hash set', () => {
  beforeAll(() => {
    mockLocation('#get-/auth/providers');
  });

  it('automatically expands the card', () => {
    let wrapper = mountOperation(onlyDescription);
    expect(wrapper.exists('Details')).toBe(true);
  });
});
