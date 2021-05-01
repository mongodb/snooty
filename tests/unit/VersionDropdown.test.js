import React from 'react';
import { shallow } from 'enzyme';
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

const publishedBranchesUnversioned = {
  version: {
    published: ['master'],
    active: ['master'],
    stable: 'master',
    upcoming: 'master',
  },
  git: {
    branches: {
      manual: 'master',
      published: ['master'],
    },
  },
};

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      parserBranch: 'master',
      pathPrefix: '/bi-connector/master',
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
    wrapper = shallow(<VersionDropdown slug="installation" publishedBranches={publishedBranches} />);
  });

  it('shows the dropdown menu', () => {
    expect(wrapper.find('StyledSelect')).toHaveLength(1);
  });

  it('shows the "master" list item is active', () => {
    expect(wrapper.find('StyledSelect').prop('value')).toBe('master');
  });

  it('has 9 list elements', () => {
    expect(wrapper.find('Option')).toHaveLength(9);
  });

  it('shows `Legacy Docs` as the last list element', () => {
    expect(wrapper.find('Option').last().prop('value')).toBe('legacy');
  });

  it('shows the proper name for master', () => {
    expect(wrapper.find('Option').first().text()).not.toBe('master');
  });
});

describe('when rendering a property without legacy docs', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<VersionDropdown slug="installation" publishedBranches={publishedBranchesNoLegacy} />);
  });

  it('has 8 list elements', () => {
    expect(wrapper.find('Option').children()).toHaveLength(8);
  });

  it('does not show `Legacy Docs` as the last list element', () => {
    expect(wrapper.find('Option').last().prop('value')).not.toBe('legacy');
  });
});

describe('when rendering an unversioned property', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<VersionDropdown slug="installation" publishedBranches={publishedBranchesUnversioned} />);
  });

  it('does not render', () => {
    expect(wrapper.find('StyledSelect')).toHaveLength(0);
  });
});
