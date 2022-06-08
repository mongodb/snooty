import { generatePrefix } from '../../src/components/VersionDropdown/utils';

describe('VersionDropdown utils', () => {
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
