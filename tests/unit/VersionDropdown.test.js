import React from 'react';
import { mount } from 'enzyme';
import VersionDropdown from '../../src/components/VersionDropdown';
import * as Gatsby from 'gatsby';

const publishedBranches = {
  version: {
    published: ['2.12', '2.11', '2.10', '2.9', '2.8', '2.7', '2.6', '2.5', '2.4', '2.2'],
    active: ['2.12', '2.11', '2.10', '2.9', '2.8', '2.7', '2.6', '2.5'],
    stable: null,
    upcoming: null,
  },
  git: {
    branches: {
      manual: 'master',
      published: ['master', 'v2.11', 'v2.10', 'v2.9', 'v2.8', 'v2.7', 'v2.6', 'v2.5', 'v2.4', 'v2.2'],
    },
  },
};

const publishedBranchesNoLegacy = {
  version: {
    published: ['2.12', '2.11', '2.10', '2.9', '2.8', '2.7', '2.6', '2.5'],
    active: ['2.12', '2.11', '2.10', '2.9', '2.8', '2.7', '2.6', '2.5'],
    stable: null,
    upcoming: null,
  },
  git: {
    branches: {
      manual: 'master',
      published: ['master', 'v2.11', 'v2.10', 'v2.9', 'v2.8', 'v2.7', 'v2.6', 'v2.5'],
    },
  },
};

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      parserBranch: 'master',
      project: 'bi-connector',
      snootyBranch: 'DOCSP-7502',
      user: 'docsworker',
    },
  },
}));

// Testing a property with legacy docs
describe('when rendered', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<VersionDropdown pathname="installation" publishedBranches={publishedBranches} />);
  });

  it('shows a button group', () => {
    expect(wrapper.find('.btn-group')).toHaveLength(1);
  });

  it('does not show the dropdown menu', () => {
    expect(wrapper.find('ul')).toHaveLength(0);
  });

  describe('when the button is clicked', () => {
    beforeAll(() => {
      wrapper.find('button').simulate('click');
    });

    it('shows the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(1);
    });

    it('shows the first list item is active', () => {
      expect(
        wrapper
          .find('li')
          .first()
          .hasClass('active')
      ).toBe(true);
    });

    // The 9th element links to the Legacy Docs page
    it('has 9 list elements', () => {
      expect(wrapper.find('ul').children()).toHaveLength(9);
    });

    it('shows `Legacy Docs` as the last list element', () => {
      expect(
        wrapper
          .find('li')
          .last()
          .text()
      ).toBe('Legacy Docs');
    });

    it('shows the proper name for master', () => {
      expect(
        wrapper
          .find('li')
          .first()
          .text()
      ).not.toBe('master');
    });
  });

  describe('when the button is clicked again', () => {
    beforeAll(() => {
      wrapper.find('button').simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });
  });
});

describe('when rendering a property without legacy docs', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<VersionDropdown pathname="installation" publishedBranches={publishedBranchesNoLegacy} />);
  });

  describe('when the button is clicked in a property without legacy docs', () => {
    beforeAll(() => {
      wrapper.find('button').simulate('click');
    });

    it('has 8 list elements', () => {
      expect(wrapper.find('ul').children()).toHaveLength(8);
    });

    it('does not show `Legacy Docs` as the last list element', () => {
      expect(
        wrapper
          .find('li')
          .last()
          .text()
      ).not.toBe('Legacy Docs');
    });
  });
});
