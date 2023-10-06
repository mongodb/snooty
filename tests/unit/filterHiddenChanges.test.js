import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import ChangeList from '../../src/components/OpenAPIChangelog/components/ChangeList';
import { ALL_VERSIONS, COMPARE_VERSIONS } from '../../src/components/OpenAPIChangelog/utils/constants';
import { hideChanges, hideDiffChanges } from '../../src/components/OpenAPIChangelog/utils/filterHiddenChanges';

import { mockChangelog, mockDiff } from './data/OpenAPIChangelog';

jest.mock('../../src/utils/use-snooty-metadata', () => () => ({
  openapi_pages: ['reference/api-resources-spec/v2'],
  project: '',
}));

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      commitHash: '',
      parserBranch: '',
      patchId: '',
      pathPrefix: '',
      snootyBranch: '',
      user: '',
    },
  },
}));

describe(' ChangeList data', () => {
  it('hideChanges function filters out all version changelog changes with "hideFromChangelog=true"', () => {
    const hiddenChanges = mockChangelog.reduce((acc, date) => {
      date.paths.forEach((path) =>
        path.versions.forEach((version) =>
          version.changes.forEach((change) => change.hideFromChangelog && acc.push(change))
        )
      );
      return acc;
    }, []);

    const unhiddenChanges = hideChanges(mockChangelog).reduce((acc, date) => {
      date.paths.forEach((path) =>
        path.versions.forEach((version) =>
          version.changes.forEach((change) => change.hideFromChangelog && acc.push(change))
        )
      );
      return acc;
    }, []);

    expect(hiddenChanges).toHaveLength(2);
    expect(unhiddenChanges).toHaveLength(0);

    const { queryByText } = render(<ChangeList changes={hideChanges(mockChangelog)} versionMode={ALL_VERSIONS} />);

    hiddenChanges.forEach((change) => {
      expect(queryByText(change.change)).toBeNull();
    });
  });

  it('does not render Diff changelog changes with "hideFromChangelog=true"', () => {
    const hiddenChanges = mockDiff.reduce((acc, resource) => {
      resource.changes.forEach((change) => change.hideFromChangelog && acc.push(change));
      return acc;
    }, []);

    const unhiddenChanges = hideDiffChanges(mockDiff).reduce((acc, resource) => {
      resource.changes.forEach((change) => change.hideFromChangelog && acc.push(change));
      return acc;
    }, []);

    expect(hiddenChanges).toHaveLength(2);
    expect(unhiddenChanges).toHaveLength(0);

    const { queryByText } = render(<ChangeList changes={hideDiffChanges(mockDiff)} versionMode={COMPARE_VERSIONS} />);

    hiddenChanges.forEach((change) => {
      expect(queryByText(change.change)).toBeNull();
    });
  });
});
