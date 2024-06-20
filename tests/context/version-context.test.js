import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { VersionContextProvider, VersionContext, STORAGE_KEY } from '../../src/context/version-context';
import * as siteMetadata from '../../src/hooks/use-site-metadata';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import * as useAssociatedProducts from '../../src/hooks/useAssociatedProducts';
import * as useAllDocsets from '../../src/hooks/useAllDocsets';
import * as browserStorage from '../../src/utils/browser-storage';
import * as realm from '../../src/utils/realm';

const snootyMetadataMock = jest.spyOn(snootyMetadata, 'default');
const uesSiteMetadataMock = jest.spyOn(siteMetadata, 'useSiteMetadata');
const useAssociatedProductsMock = jest.spyOn(useAssociatedProducts, 'useAllAssociatedProducts');
const useAllDocsetsMock = jest.spyOn(useAllDocsets, 'useAllDocsets');
const project = 'cloud-docs';

const cloudDocsRepoBranches = {
  branches: [
    {
      name: 'master',
      publishOriginalBranchName: false,
      active: true,
      aliases: null,
      gitBranchName: 'master',
      urlSlug: null,
      urlAliases: null,
      isStableBranch: true,
      id: { $oid: '62e29389da7afd105b30c360' },
    },
  ],
};
const mockedAssociatedRepoInfo = {
  'atlas-cli': {
    branches: [
      {
        gitBranchName: 'master',
        publishOriginalBranchName: true,
        active: true,
        isStableBranch: false,
        urlAliases: ['upcoming'],
        urlSlug: 'upcoming',
        versionSelectorLabel: 'Beta',
        buildsWithSnooty: true,
        id: { $oid: '62e2938ada7afd105b30c3d0' },
      },
      {
        publishOriginalBranchName: true,
        active: true,
        aliases: ['stable'],
        gitBranchName: 'v1.2',
        isStableBranch: true,
        urlAliases: ['stable'],
        urlSlug: 'stable',
        versionSelectorLabel: 'Stable',
        buildsWithSnooty: true,
        id: { $oid: '62e2938ada7afd105b30c3d1' },
      },
      {
        publishOriginalBranchName: true,
        active: true,
        aliases: ['test'],
        gitBranchName: 'v1.1',
        isStableBranch: true,
        urlAliases: ['stable'],
        urlSlug: 'stable',
        versionSelectorLabel: 'Stable',
        buildsWithSnooty: true,
      },
      {
        publishOriginalBranchName: true,
        active: false,
        aliases: ['test'],
        gitBranchName: 'v1.0',
        isStableBranch: true,
        urlAliases: [],
        urlSlug: 'v1.0',
        versionSelectorLabel: 'v1.0',
        buildsWithSnooty: true,
      },
    ],
  },
};

const setProjectAndAssociatedProducts = () => {
  uesSiteMetadataMock.mockImplementation(() => ({
    parserBranch: 'master',
  }));
  snootyMetadataMock.mockImplementation(() => ({
    project,
    associated_products: [
      {
        name: 'atlas-cli',
        versions: ['v1.1', 'v1.2', 'master'],
      },
    ],
  }));
  useAssociatedProductsMock.mockImplementation(() => ['atlas-cli']);
  useAllDocsetsMock.mockImplementation(() => [
    {
      project: 'cloud-docs',
      branches: cloudDocsRepoBranches.branches,
    },
    {
      project: 'atlas-cli',
      branches: mockedAssociatedRepoInfo['atlas-cli']['branches'],
    },
  ]);
};

const getKey = (project, branchName) => `${project}-${branchName}`;

const TestConsumer = () => {
  const { activeVersions, setActiveVersions, availableVersions } = useContext(VersionContext);

  const handleClick = (project, version) => {
    const value = {};
    value[project] = version;
    setActiveVersions(value);
  };

  const versionElms = [];
  for (let project in availableVersions) {
    for (let branch of availableVersions[project]) {
      versionElms.push(
        <div
          onClick={() => {
            handleClick(project, branch.gitBranchName);
          }}
          key={getKey(project, branch.gitBranchName)}
          id={getKey(project, branch.gitBranchName)}
        >
          {getKey(project, branch.gitBranchName)}
        </div>
      );
    }
  }
  return (
    <>
      <h1>active versions:</h1>
      <div id="active-versions">{JSON.stringify(activeVersions)}</div>
      <h1>availableVersions:</h1>
      <div id="available-versions">{versionElms}</div>
    </>
  );
};

const mountConsumer = () => {
  setProjectAndAssociatedProducts();
  return render(
    <VersionContextProvider repoBranches={cloudDocsRepoBranches}>
      test consumer below
      <TestConsumer />
    </VersionContextProvider>
  );
};

const mountAtlasCliConsumer = (eol) => {
  const project = 'atlas-cli';
  uesSiteMetadataMock.mockImplementationOnce(() => ({
    project: project,
    parserBranch: eol ? 'v1.0' : 'master',
  }));

  snootyMetadataMock.mockImplementationOnce(() => {
    return {
      project,
      associated_products: [],
    };
  });

  return render(
    <VersionContextProvider repoBranches={mockedAssociatedRepoInfo['atlas-cli']}>
      test consumer below
      <TestConsumer />
    </VersionContextProvider>
  );
};

describe('Version Context', () => {
  let wrapper,
    mockedBrowserStorageSetter,
    mockedBrowserStorageGetter,
    mockedLocalStorage = {},
    mockedFetchDocset,
    mockFetchDocuments;

  beforeEach(() => {
    mockedLocalStorage = {};
    mockedBrowserStorageSetter = jest
      .spyOn(browserStorage, 'setLocalValue')
      .mockImplementation((localStorageKey, value) => {
        mockedLocalStorage[localStorageKey] = value;
      });

    mockedBrowserStorageGetter = jest.spyOn(browserStorage, 'getLocalValue').mockImplementation((key) => {
      return mockedLocalStorage[key];
    });
    mockedFetchDocset = jest.spyOn(realm, 'fetchDocset').mockImplementation(async (database, matchConditions) => {
      switch (matchConditions.project) {
        case 'cloud-docs':
          return {
            project: 'cloud-docs',
            branches: [
              {
                name: 'master',
                publishOriginalBranchName: false,
                active: true,
                aliases: null,
                gitBranchName: 'master',
                urlSlug: null,
                urlAliases: null,
                isStableBranch: true,
              },
            ],
          };
        case 'atlas-cli':
          return {
            project: 'atlas-cli',
            branches: [
              { gitBranchName: 'master', isStableBranch: false, active: true },
              { gitBranchName: 'v1.2', isStableBranch: true, active: true },
              { gitBranchName: 'v1.1', isStableBranch: true, active: true },
              { gitBranchName: 'v1.0', isStableBranch: false, active: false },
            ],
          };
        default:
          break;
      }
      return {
        database,
        matchConditions,
      };
    });
  });
  mockFetchDocuments = jest.spyOn(realm, 'fetchDocument').mockImplementation(async (dbName, collectionName, query) => {
    if (query && query['associated_products'] === 'docs-atlas-cli') {
      return {}; // spoofing data for "at least one parent association"
    }
    return [];
  });

  afterAll(() => {
    mockedFetchDocset.mockClear();
    mockedBrowserStorageSetter.mockClear();
    mockedBrowserStorageGetter.mockClear();
    mockFetchDocuments.mockClear();
  });

  it('it has initial available and active version values if local storage is empty', async () => {
    // available checks
    await act(async () => {
      wrapper = mountConsumer();
    });
    for (let branch of cloudDocsRepoBranches.branches) {
      expect(await wrapper.findByText(getKey(project, branch.gitBranchName))).toBeTruthy();
    }
    for (let projectName in mockedAssociatedRepoInfo) {
      for (let branch of mockedAssociatedRepoInfo[projectName].branches) {
        if (branch.active) expect(await wrapper.findByText(getKey(projectName, branch.gitBranchName))).toBeTruthy();
      }
    }

    // active checks
    const expectedActive = { 'cloud-docs': 'master', 'atlas-cli': 'master' };
    expect(await wrapper.findByText(JSON.stringify(expectedActive))).toBeTruthy();
  });

  it('initializes with values from local storage', async () => {
    mockedLocalStorage[STORAGE_KEY] = { 'atlas-cli': 'v1.2' };
    const expectedActive = { 'cloud-docs': 'master', 'atlas-cli': 'v1.2' };
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(await wrapper.findAllByText(JSON.stringify(expectedActive))).toBeTruthy();
  });

  it('updates context values and local storage if called from consumers', async () => {
    await act(async () => {
      wrapper = mountConsumer();
    });
    const option = wrapper.getByText('atlas-cli-master');
    userEvent.click(option);
    const expectedActive = { 'cloud-docs': 'master', 'atlas-cli': 'master' };
    expect(await wrapper.findByText(JSON.stringify(expectedActive))).toBeTruthy();
  });

  it('calls client stitch fn to fetch documents on load', async () => {
    // TODO. mock realm
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(mockedFetchDocset).toHaveBeenCalled();
  });

  it('initializes activeVersions values with no EOL branches if current version is not EOL', async () => {
    const project = 'atlas-cli';
    await act(async () => {
      wrapper = mountAtlasCliConsumer(false);
    });
    for (let branch of mockedAssociatedRepoInfo['atlas-cli'].branches) {
      if (branch.active) expect(await wrapper.findByText(getKey(project, branch.gitBranchName))).toBeTruthy();
      else expect(await wrapper.queryByText(getKey(project, branch.gitBranchName))).toBeNull();
    }
  });

  it('initializes activeVersions values with EOL branches if current version is EOL', async () => {
    const project = 'atlas-cli';
    await act(async () => {
      wrapper = mountAtlasCliConsumer(true);
    });
    for (let branch of mockedAssociatedRepoInfo['atlas-cli'].branches) {
      expect(await wrapper.findByText(getKey(project, branch.gitBranchName))).toBeTruthy();
    }
  });
});
