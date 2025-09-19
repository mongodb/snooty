import React, { useContext } from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import * as documentsApi from '../../src/utils/data/documents';
import * as siteMetadata from '../../src/hooks/use-site-metadata';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import { VersionContext } from '../../src/context/version-context';

import { TocContext, TocContextProvider } from '../../src/context/toc-context';

// <------------------ START test data mocks ------------------>
const siteMetadataMock = jest.spyOn(siteMetadata, 'useSiteMetadata');
const snootyMetadataMock = jest.spyOn(snootyMetadata, 'default');
const documentsApiMock = jest.spyOn(documentsApi, 'fetchDocument');
const project = 'cloud-docs';

let sampleTocTree, responseTree, mockedResponse;

const setResponse = () => {
  sampleTocTree = {
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
        options: {
          versions: ['v1.0'],
          project: 'atlas-cli',
          urls: {
            'v1.0': 'sample-page3-v1.0',
          },
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
  responseTree = JSON.parse(JSON.stringify(sampleTocTree));
  responseTree.children[responseTree.children.length - 1].options = {
    versions: ['v1.0', 'v1.2', 'v0.8'],
    project: 'atlas-cli',
    urls: {
      'v1.0': 'sample-page3-v1.0',
      'v1.2': 'sample-page3-v1.2',
      'v0.8': 'sample-page3-v0.8',
    },
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

  mockedResponse = {
    toctree: responseTree,
  };
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
    branch: 'master',
    toctree: sampleTocTree,
  }));

  // mock realm
  documentsApiMock.mockImplementation(() => {
    return mockedResponse;
  });
};

// <------------------ END test data mocks ------------------>

// <------------------ START render helpers ------------------>

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
  const setActiveVersions = (newState) => {
    availableVersions = {
      ...availableVersions,
      ...newState,
    };
  };
  return render(
    <VersionContext.Provider value={{ activeVersions, availableVersions, setActiveVersions }}>
      <TocContextProvider>
        <TestConsumer></TestConsumer>
      </TocContextProvider>
    </VersionContext.Provider>
  );
};

// <------------------ END render helpers ------------------>

describe('ToC Context', () => {
  let wrapper;

  beforeEach(async () => {
    setResponse();
    setMocks();
  });

  it('sets ToC based on response realm app service response', async () => {
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(wrapper.getByText(/options/g)).toBeTruthy();
    expect(wrapper.getByText(/v1.0/g)).toBeTruthy();
    expect(wrapper.getByText(/v1.2/g)).toBeTruthy();
  });

  it('calls realm function to fetch data', async () => {
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(documentsApiMock).toHaveBeenCalled();
  });

  it('falls back to server side metadata if realm call fails', async () => {
    documentsApiMock.mockRejectedValueOnce(new Error('test'));
    await act(async () => {
      wrapper = mountConsumer();
    });
    expect(documentsApiMock).toHaveBeenCalled();
    expect(wrapper.getByText(/options/g)).toBeTruthy();
    expect(wrapper.getByText(/v1.0/g)).toBeTruthy();
    expect(wrapper.queryByText(/v1.2/g)).toBeNull();
  });
});
