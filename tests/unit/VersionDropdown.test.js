import { generatePrefix } from '../../src/components/VersionDropdown/utils';

describe('VersionDropdown utils', () => {
  describe('generatePrefix', () => {
    it('returns a prefix when a simple pathPrefix exists', () => {
      const mockSiteMetadata = {
        pathPrefix: '/docs/bi-connector/v2.14',
        project: 'bi-connector',
      };

      expect(generatePrefix('v2.15', mockSiteMetadata)).toBe('/docs/bi-connector/v2.15');
    });

    it('returns a prefix when a pathPrefix exists for the server docs', () => {
      const mockSiteMetadata = {
        pathPrefix: '/docs/upcoming',
        project: 'docs',
      };

      expect(generatePrefix('v100', mockSiteMetadata)).toBe('/docs/v100');
    });

    it('returns a prefix when a pathPrefix with multiple forward slashes exists', () => {
      const mockSiteMetadata = {
        pathPrefix: '/docs/realm/sdk/android/v10.1',
        project: 'realm',
      };

      expect(generatePrefix('sdk/android/v10.2', mockSiteMetadata)).toBe('/docs/realm/sdk/android/v10.2');
    });

    it('returns a prefix when staging with no pathPrefix', () => {
      const mockSiteMetadata = {
        project: 'bi-connector',
        snootyEnv: 'staging',
        user: 'docsworker-xlarge',
      };

      expect(generatePrefix('v2.15', mockSiteMetadata)).toBe('/bi-connector/docsworker-xlarge/v2.15');
    });

    it('returns a default prefix when in development with no pathPrefix', () => {
      const mockSiteMetadata = {
        project: 'bi-connector',
        snootyEnv: 'development',
      };

      expect(generatePrefix('v2.15', mockSiteMetadata)).toBe('/v2.15');
    });
  });
});
