import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import ChangeList from '../../src/components/OpenAPIChangelog/components/ChangeList';
import { ALL_VERSIONS, COMPARE_VERSIONS } from '../../src/components/OpenAPIChangelog/utils/constants';
import { mockChangelog, mockDiff } from './data/OpenAPIChangelog';

jest.mock('../../src/utils/use-snooty-metadata', () => () => ({
  openapi_pages: ['reference/api-resources-spec/v2'],
}));

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      commitHash: '',
      parserBranch: '',
      patchId: '',
      pathPrefix: '',
      project: '',
      snootyBranch: '',
      user: '',
    },
  },
}));

describe('OpenAPIChangelog ChangeList', () => {
  it('ChangeList renders all version changelog correctly', () => {
    const tree = render(<ChangeList changes={mockChangelog} versionMode={ALL_VERSIONS} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('ChangeList renders diff changelog correctly', () => {
    const tree = render(<ChangeList changes={mockDiff} versionMode={COMPARE_VERSIONS} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
