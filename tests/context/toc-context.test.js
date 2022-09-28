import React, { useContext } from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import * as realm from '../../src/utils/realm';
import * as siteMetadata from '../../src/hooks/use-site-metadata';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import { VersionContext } from '../../src/context/version-context';

import { TocContext, TocContextProvider } from '../../src/context/toc-context';

// set sample server data
const siteMetadataMock = jest.spyOn(siteMetadata, 'useSiteMetadata');
const snootyMetadataMock = jest.spyOn(snootyMetadata, 'default');
const realmMock = jest.spyOn(realm, 'fetchDocument');
const project = 'cloud-docs';
const sampleTocTree = {
  title: [{ type: 'text', position: { start: { line: 0 } }, value: 'MongoDB Atlas' }],
  slug: '/',
  children: [
    {
      title: [{ type: 'text', position: { start: { line: 1 } }, value: 'sample page' }],
      slug: 'sample-page',
      children: [],
    },
    {
      title: [{ type: 'text', position: { start: { line: 1 } }, value: 'sample page2' }],
      slug: 'sample-page2',
      children: [],
    },
    {
      title: [{ type: 'text', position: { start: { line: 1 } }, value: 'sample page3' }],
      slug: 'sample-page3',
      options: {
        versions: ['v1.0'],
        project: 'atlas-cli',
      },
      children: [
        {
          title: [{ type: 'text', position: { start: { line: 1 } }, value: 'sample child v1.0' }],
          slug: 'sample-child-v1.0',
          options: {
            version: 'v1.0',
          },
        },
      ],
    },
  ],
};
// set sample response data with deep copied sample toc
const responseTree = JSON.parse(JSON.stringify(sampleTocTree));
responseTree.children[responseTree.children.length - 1].options = {
  versions: ['v1.0', 'v1.2', 'v0.8'],
  project: 'atlas-cli',
};
responseTree.children[responseTree.children.length - 1].children.push({
  title: [{ type: 'text', position: { start: { line: 1 } }, value: 'sample child v1.2' }],
  slug: 'sample-child-v1.2',
  options: {
    version: 'v1.2',
  },
});

responseTree.children[responseTree.children.length - 1].children.push({
  title: [{ type: 'text', position: { start: { line: 1 } }, value: 'sample child v0.8' }],
  slug: 'sample-child-v0.8',
  options: {
    version: 'v0.8',
  },
});

const mockedResponse = {
  toctree: responseTree,
};

const setMocks = () => {
  // mock server metadata
  siteMetadataMock.mockImplementation(() => ({
    project: project,
    database: 'snooty_dev',
    parserUser: 'spark',
    parserBranch: 'master',
  }));

  snootyMetadataMock.mockImplementation(() => ({
    toctree: sampleTocTree,
  }));

  // mock realm
  realmMock.mockResolvedValue(mockedResponse);
};

const TestConsumer = () => {
  const { activeToc } = useContext(TocContext);
  return <div>{JSON.stringify(activeToc)}</div>;
};

const mountConsumer = (
  // mock version context by wrapping it with versions and activeToc
  activeVersions = { 'atlas-cli': 'v1.0', 'cloud-docs': 'master' },
  availableVersions = {
    'atlas-cli': [{ gitBranchName: 'v1.0' }, { gitBranchName: 'v1.2' }],
    'cloud-docs': [{ gitBranchName: 'master' }],
  }
) => {
  return render(
    <VersionContext.Provider value={{ activeVersions, availableVersions }}>
      <TocContextProvider>
        <TestConsumer></TestConsumer>
      </TocContextProvider>
    </VersionContext.Provider>
  );
};

describe('ToC Context', () => {
  let wrapper;

  beforeEach(async () => {
    setMocks();
  });

  it('sets ToC filtered by versioned nodes returned by realm call', async () => {
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(wrapper.getByText(/options/g)).toBeTruthy();
    expect(wrapper.getByText(/v1.0/g)).toBeTruthy();
    expect(wrapper.getByText(/v1.2/g)).toBeTruthy();
  });

  it('initializes ToC without versioned nodes if not in available versions', async () => {
    await act(async () => {
      wrapper = mountConsumer({}, {});
    });
    expect(wrapper.queryByText(/options/g)).toBeNull();
  });

  it('calls realm function to fetch data', async () => {
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(realmMock).toHaveBeenCalled();
  });

  it('falls back to server side metadata if realm call fails', async () => {
    realmMock.mockRejectedValueOnce(new Error('test'));
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(realmMock).toHaveBeenCalled();
    expect(wrapper.getByText(/options/g)).toBeTruthy();
    expect(wrapper.getByText(/v1.0/g)).toBeTruthy();
    expect(wrapper.queryByText(/v1.2/g)).toBeNull();
  });
});
