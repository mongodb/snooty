import React from 'react';
import { mount } from 'enzyme';
import VersionDropdown from '../../src/components/VersionDropdown';
import * as Gatsby from 'gatsby';

const publishedBranches = {
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

    it('has 8 list elements', () => {
      expect(wrapper.find('ul').children()).toHaveLength(8);
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
