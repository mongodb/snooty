import { render, screen, within } from '@testing-library/react';
import { navigate } from '@gatsbyjs/reach-router';
import userEvent from '@testing-library/user-event';
import * as documentsApi from '../../src/utils/data/documents';
import * as docsetApi from '../../src/utils/data/docsets';
import VersionDropdown from '../../src/components/VersionDropdown';
import * as useAssociatedProducts from '../../src/hooks/useAssociatedProducts';
import * as useAllDocsets from '../../src/hooks/useAllDocsets';
import { VersionContextProvider } from '../../src/context/version-context';
import { tick } from '../utils';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ parserBranch: 'master', snootyEnv: 'development' }),
}));

jest.mock('../../src/utils/use-snooty-metadata', () => {
  return () => ({ project: 'node', eol: false });
});

jest.mock('@gatsbyjs/reach-router', () => ({
  navigate: jest.fn(),
}));

const useAssociatedProductsMock = jest.spyOn(useAssociatedProducts, 'useAllAssociatedProducts');
const useAllDocsetsMock = jest.spyOn(useAllDocsets, 'useAllDocsets');
useAssociatedProductsMock.mockImplementation(() => ['atlas-cli']);
useAllDocsetsMock.mockImplementation(() => [
  {
    project: 'cloud-docs',
    branches: [],
  },
  {
    project: 'atlas-cli',
    branches: [],
  },
]);

const fetchDocuments = () => {
  return jest.spyOn(documentsApi, 'fetchDocuments').mockImplementation(async (dbName, collectionName, query) => {
    if (query && query['associated_products'] === 'docs-atlas-cli') {
      return [{}]; // spoofing data for "at least one parent association"
    }
    return [];
  });
};

const fetchDocument = () => {
  return jest.spyOn(documentsApi, 'fetchDocument').mockImplementation(async () => {
    return {};
  });
};

const fetchDocset = () => {
  return jest.spyOn(docsetApi, 'fetchDocset').mockImplementation(async (database, project) => {
    switch (project) {
      case 'node':
        return {
          project: 'node',
          branches: [
            {
              name: 'master',
              publishOriginalBranchName: false,
              active: true,
              aliases: null,
              gitBranchName: 'master',
              urlSlug: 'upcoming',
              urlAliases: null,
              isStableBranch: true,
            },
            {
              name: 'v4.11',
              publishOriginalBranchName: false,
              active: true,
              aliases: null,
              gitBranchName: 'v4.11',
              urlSlug: 'v4.11',
              urlAliases: ['v4.11'],
              isStableBranch: true,
            },
            {
              name: 'v4.10',
              publishOriginalBranchName: false,
              active: true,
              aliases: null,
              gitBranchName: 'v4.10',
              urlSlug: 'v4.10',
              urlAliases: ['v4.10'],
              isStableBranch: true,
            },
          ],
        };
      default:
        break;
    }
    return {
      database,
      project,
    };
  });
};

const docsNodeRepoBranches = {
  siteBasePrefix: 'docs-test/drivers/node',
  branches: [
    {
      name: 'master',
      publishOriginalBranchName: false,
      active: true,
      aliases: null,
      gitBranchName: 'master',
      urlSlug: 'upcoming',
      urlAliases: null,
      isStableBranch: true,
      id: { $oid: '62e293ce8b1d857926ab4c7d' },
    },
    {
      gitBranchName: 'v4.11',
      active: true,
      urlAliases: ['current'],
      publishOriginalBranchName: true,
      urlSlug: 'current',
      versionSelectorLabel: 'v4.11 (current)',
      isStableBranch: true,
      buildsWithSnooty: true,
      id: { $oid: '62e293ce8b1d8526ab4c7e11' },
    },
    {
      gitBranchName: 'v4.10',
      active: true,
      urlAliases: [],
      publishOriginalBranchName: true,
      urlSlug: 'v4.10',
      versionSelectorLabel: 'v4.10',
      isStableBranch: false,
      buildsWithSnooty: true,
      id: { $oid: '62e293ce8b1d857926ab4c7e' },
    },
  ],
};

const queryElementWithin = (versionDropdown, role) => within(versionDropdown).queryByRole(role);

const mountConsumer = async () => {
  const res = render(
    <VersionContextProvider repoBranches={docsNodeRepoBranches} slug={'/'}>
      <VersionDropdown />
    </VersionContextProvider>
  );
  // Wait for any on-mount updates to occur. Prevents warnings about needing to wrap updates in act()
  await tick();
  return res;
};

describe('VersionDropdown', () => {
  describe('Component', () => {
    jest.useFakeTimers();
    let mockFetchDocuments, mockedFetchDocset, mockFetchDocument;

    beforeEach(() => {
      mockFetchDocument = fetchDocument();
      mockFetchDocuments = fetchDocuments();
      mockedFetchDocset = fetchDocset();
    });

    afterAll(() => {
      mockFetchDocument.mockClear();
      mockFetchDocuments.mockClear();
      mockedFetchDocset.mockClear();
    });

    it('renders correctly', async () => {
      const tree = await mountConsumer();
      expect(tree.asFragment()).toMatchSnapshot();
    });

    it('renders the dropdown with the correct version', async () => {
      await mountConsumer();
      const versionDropdown = screen.queryByRole('button', { value: 'master' });
      expect(versionDropdown).toBeInTheDocument();
    });

    it('show version options when user clicks button', async () => {
      await mountConsumer();
      const versionDropdown = screen.queryByRole('button', { value: 'master' });
      let versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');
      expect(versionOptionsDropdown).not.toBeInTheDocument();

      userEvent.click(versionDropdown);
      // For some reason, this click needs to wait
      await tick();

      versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');
      expect(versionOptionsDropdown).toBeInTheDocument();
    });

    it('calls the navigate function when a user clicks on a version', async () => {
      await mountConsumer();

      const versionDropdown = screen.queryByRole('button', { value: 'master' });
      expect(versionDropdown).toBeInTheDocument();

      userEvent.click(versionDropdown);

      const versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');
      const versionOptions = within(versionOptionsDropdown).queryAllByRole('option');
      expect(versionOptions.length).toBe(3);

      userEvent.click(versionOptions[1], undefined, {
        skipPointerEventsCheck: true,
      });

      expect(navigate).toBeCalled();
      expect(navigate).toBeCalledWith('/docs-test/drivers/node/v4.11/');
    });

    it('calls the navigate function for translated pages', async () => {
      // Pretend page exists on Korean-translated site
      global.window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/ko-kr/docs-test/drivers/node/current',
        },
      });

      await mountConsumer();

      const versionDropdown = screen.queryByRole('button', { value: 'master' });
      expect(versionDropdown).toBeInTheDocument();

      userEvent.click(versionDropdown);

      const versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');
      const versionOptions = within(versionOptionsDropdown).queryAllByRole('option');
      expect(versionOptions.length).toBe(3);

      userEvent.click(versionOptions[1], undefined, {
        skipPointerEventsCheck: true,
      });

      expect(navigate).toBeCalledWith('/ko-kr/docs-test/drivers/node/v4.11/');
    });
  });
});
