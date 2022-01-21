import React from 'react';
import { render } from '@testing-library/react';
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
  it('shows the dropdown menu', () => {
    const wrapper = render(<VersionDropdown slug="installation" publishedBranches={publishedBranches} />);
    expect(wrapper.getByRole('button')).toBeTruthy();
  });

  it('shows the "master" list item is active', () => {
    const wrapper = render(<VersionDropdown slug="installation" publishedBranches={publishedBranches} />);
    expect(wrapper.getByText('Version 2.12')).toBeTruthy();
  });

  it('shows the proper name for master', () => {
    const wrapper = render(<VersionDropdown slug="installation" publishedBranches={publishedBranches} />);
    expect(wrapper.getByText('Version 2.12')).toBeTruthy();
  });
});

describe('when rendering an unversioned property', () => {
  it('does not render', () => {
    const wrapper = render(<VersionDropdown slug="installation" publishedBranches={publishedBranchesUnversioned} />);
    expect(wrapper.queryAllByText('Version 2.12')).toHaveLength(0);
  });
});
