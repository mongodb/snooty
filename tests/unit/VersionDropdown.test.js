import { render, screen, act, within } from '@testing-library/react';
import { navigate } from '@gatsbyjs/reach-router';
import userEvent from '@testing-library/user-event';
import * as realm from '../../src/utils/realm';
import { generatePrefix } from '../../src/components/VersionDropdown/utils';
import VersionDropdown from '../../src/components/VersionDropdown';
import * as useAssociatedProducts from '../../src/hooks/useAssociatedProducts';
import * as useAllDocsets from '../../src/hooks/useAllDocsets';
import mockData from '../unit/data/VersionDropdown.test.json';
import { VersionContextProvider } from '../../src/context/version-context';
import { tick } from '../utils';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ parserBranch: 'master', snootyEnv: 'development' }),
}));

jest.mock('../../src/utils/use-snooty-metadata', () => {
  return () => ({ project: 'node' });
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
  return jest.spyOn(realm, 'fetchDocuments').mockImplementation(async (dbName, collectionName, query) => {
    if (query && query['associated_products'] === 'docs-atlas-cli') {
      return [{}]; // spoofing data for "at least one parent association"
    }
    return [];
  });
};

const fetchDocument = () => {
  return jest.spyOn(realm, 'fetchDocument').mockImplementation(async () => {
    return {};
  });
};

const fetchDocset = () => {
  return jest.spyOn(realm, 'fetchDocset').mockImplementation(async (database, matchConditions) => {
    switch (matchConditions.project) {
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
              urlSlug: null,
              urlAliases: null,
              isStableBranch: true,
            },
            {
              name: 'v4.11',
              publishOriginalBranchName: false,
              active: true,
              aliases: null,
              gitBranchName: 'v4.11',
              urlSlug: null,
              urlAliases: ['v.411'],
              isStableBranch: true,
            },
            {
              name: 'v4.10',
              publishOriginalBranchName: false,
              active: true,
              aliases: null,
              gitBranchName: 'v4.10',
              urlSlug: null,
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
      matchConditions,
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
      urlSlug: null,
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

const mountConsumer = () => {
  return render(
    <VersionContextProvider repoBranches={docsNodeRepoBranches} slug={'/'}>
      <VersionDropdown eol={mockData.eol} slug={mockData.slug} repoBranches={docsNodeRepoBranches} />
    </VersionContextProvider>
  );
};

describe('VersionDropdown', () => {
  describe('utils', () => {
    describe('generatePrefix', () => {
      it('returns a prefix when a simple pathPrefix exists', () => {
        const mockSiteMetadata = {
          pathPrefix: '/docs/bi-connector/v2.14',
        };
        const mockSiteBasePrefix = 'docs/bi-connector';

        expect(generatePrefix('v2.15', mockSiteMetadata, mockSiteBasePrefix)).toBe('/docs/bi-connector/v2.15');
      });

      it('returns a prefix when a pathPrefix exists for the server docs', () => {
        const mockSiteMetadata = {
          pathPrefix: '/docs/upcoming',
        };
        const mockSiteBasePrefix = 'docs';

        expect(generatePrefix('v100', mockSiteMetadata, mockSiteBasePrefix)).toBe('/docs/v100');
      });

      it("returns a prefix when the site's base prefix has more than 1 forward slash", () => {
        const mockSiteMetadata = {
          pathPrefix: '/docs/atlas/cli/master',
        };
        const mockSiteBasePrefix = 'docs/atlas/cli';

        expect(generatePrefix('upcoming', mockSiteMetadata, mockSiteBasePrefix)).toBe('/docs/atlas/cli/upcoming');
      });

      it('returns a prefix when a urlSlug/version with multiple forward slashes exists', () => {
        const mockSiteMetadata = {
          pathPrefix: '/docs/realm/sdk/android/v10.1',
        };
        const mockSiteBasePrefix = 'docs/realm';

        expect(generatePrefix('sdk/android/v10.2', mockSiteMetadata, mockSiteBasePrefix)).toBe(
          '/docs/realm/sdk/android/v10.2'
        );
      });

      it('returns a prefix when staging with no pathPrefix', () => {
        const mockSiteMetadata = {
          project: 'bi-connector',
          snootyEnv: 'staging',
          user: 'docsworker-xlarge',
        };
        const mockSiteBasePrefix = 'docs/bi-connector';

        expect(generatePrefix('v2.15', mockSiteMetadata, mockSiteBasePrefix)).toBe(
          '/bi-connector/docsworker-xlarge/v2.15'
        );
      });

      it('returns a prefix when in development with no pathPrefix', () => {
        const mockSiteMetadata = {
          project: 'bi-connector',
          snootyEnv: 'development',
        };
        const mockSiteBasePrefix = 'docs/bi-connector';

        expect(generatePrefix('v2.15', mockSiteMetadata, mockSiteBasePrefix)).toBe('/docs/bi-connector/v2.15');
      });
    });
  });

  describe('Component', () => {
    jest.useFakeTimers();
    let mockFetchDocuments, mockedFetchDocset, mockFetchDocument;

    beforeEach(async () => {
      mockFetchDocument = fetchDocument();
      mockFetchDocuments = fetchDocuments();
      mockedFetchDocset = fetchDocset();
    });

    afterAll(async () => {
      mockFetchDocument.mockClear();
      mockFetchDocuments.mockClear();
      mockedFetchDocset.mockClear();
    });

    it('renders correctly', async () => {
      let tree;
      await act(async () => {
        tree = mountConsumer();
      });
      expect(tree.asFragment()).toMatchSnapshot();
    });
    it('renders the dropdown with the correct version', async () => {
      await act(async () => {
        mountConsumer();
      });
      const versionDropdown = screen.queryByRole('button', { name: 'master' });
      expect(versionDropdown).toBeInTheDocument();
    });

    it('show version options when user clicks button', async () => {
      await act(async () => {
        mountConsumer();
      });

      const versionDropdown = screen.queryByRole('button', { name: 'master' });
      let versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');
      expect(versionOptionsDropdown).not.toBeInTheDocument();

      await act(async () => {
        userEvent.click(versionDropdown);
      });
      await tick();

      versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');
      expect(versionOptionsDropdown).toBeInTheDocument();
    });

    it('calls the navigate function when a user clicks on a version', async () => {
      await act(async () => {
        mountConsumer();
      });

      let versionDropdown = screen.queryByRole('button', { name: 'master' });
      expect(versionDropdown).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(versionDropdown);
      });
      await tick();

      const versionOptionsDropdown = queryElementWithin(versionDropdown, 'listbox');

      const versionOptions = within(versionOptionsDropdown).queryAllByRole('option');
      expect(versionOptions.length).toBe(3);

      await act(async () => {
        await userEvent.click(versionOptions[1], undefined, {
          skipPointerEventsCheck: true,
        });
      });

      await tick();

      expect(navigate).toBeCalled();
      expect(navigate).toBeCalledWith('/docs-test/drivers/node/v.411/');
    });
  });
});
