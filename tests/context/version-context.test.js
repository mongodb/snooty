import React, { useContext } from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { VersionContextProvider, VersionContext, STORAGE_KEY } from '../../src/context/version-context';
import * as browserStorage from '../../src/utils/browser-storage';
import userEvent from '@testing-library/user-event';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const project = 'cloud-docs';
const setProjectAndAssociatedProducts = () => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        project: project,
        associatedProducts: [
          {
            name: 'atlas-cli',
            versions: ['v1.1', 'v1.0'],
          },
        ],
      },
    },
  }));
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
        gitBranchName: 'v1.0',
        isStableBranch: true,
        urlAliases: ['stable'],
        urlSlug: 'stable',
        versionSelectorLabel: 'Stable',
        buildsWithSnooty: true,
        id: { $oid: '62e2938ada7afd105b30c3d1' },
      },
    ],
  },
};

const mountConsumer = () => {
  setProjectAndAssociatedProducts();
  return render(
    <VersionContextProvider repoBranches={cloudDocsRepoBranches} associatedReposInfo={mockedAssociatedRepoInfo}>
      test consumer below
      <TestConsumer />
    </VersionContextProvider>
  );
};

describe('Version Context', () => {
  let wrapper, mockedBrowserStorageSetter, mockedBrowserStorageGetter, mockedLocalStorage;

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
  });

  afterAll(() => {
    mockedBrowserStorageSetter.mockClear();
    mockedBrowserStorageGetter.mockClear();
  });

  it('it has initial available and active version values if local storage is empty', async () => {
    // available checks
    await act(async () => {
      wrapper = mountConsumer();
    });
    cloudDocsRepoBranches.branches.forEach((branch) => {
      expect(wrapper.getByText(getKey(project, branch.gitBranchName))).toBeTruthy();
    });
    for (let projectName in mockedAssociatedRepoInfo) {
      for (let branch of mockedAssociatedRepoInfo[projectName].branches) {
        expect(wrapper.getByText(getKey(projectName, branch.gitBranchName))).toBeTruthy();
      }
    }

    // active checks
    const expectedActive = { 'cloud-docs': 'master', 'atlas-cli': 'v1.0' };
    expect(wrapper.getByText(JSON.stringify(expectedActive))).toBeTruthy();
  });

  it('initializes with values from local storage', async () => {
    mockedLocalStorage[STORAGE_KEY] = { 'atlas-cli': 'master' };
    await act(async () => {
      wrapper = mountConsumer();
    });
    const expectedActive = { 'atlas-cli': 'master' };
    expect(wrapper.getAllByText(JSON.stringify(expectedActive))).toBeTruthy();
  });

  it('updates context values and local storage if called from consumers', async () => {
    await act(async () => {
      wrapper = mountConsumer();
    });
    const option = wrapper.getByText('atlas-cli-master');
    userEvent.click(option);
    const expectedActive = { 'cloud-docs': 'master', 'atlas-cli': 'master' };
    expect(wrapper.getByText(JSON.stringify(expectedActive))).toBeTruthy();
  });

  it('calls client stitch fn to fetch documents on load', () => {
    // TODO. mock stitch
  });
});
