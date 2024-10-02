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

  it('changes with the changeCode "operation-id-changed" and "operation-tag-changed" should not be visible', () => {
    const hiddenChanges = mockDiff.reduce((acc, resource) => {
      resource.changes.forEach(
        (change) =>
          (change.changeCode === 'operation-id-changed' || change.changeCode === 'operation-tag-changed') &&
          acc.push(change)
      );
      return acc;
    }, []);

    const { queryByText } = render(<ChangeList changes={mockDiff} versionMode={COMPARE_VERSIONS} />);

    expect(hiddenChanges).toHaveLength(2);

    hiddenChanges.forEach((change) => {
      expect(queryByText(change.change)).toBeNull();
    });
  });
});
