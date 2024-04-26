import { generateVersionedPrefix } from '../../../src/utils/generate-versioned-prefix';

describe('generateVersionedPrefix', () => {
  it('returns a prefix when a simple pathPrefix exists', () => {
    const mockSiteBasePrefix = 'docs/bi-connector';
    expect(generateVersionedPrefix('v2.15', mockSiteBasePrefix)).toBe('/docs/bi-connector/v2.15');
  });

  it('returns a prefix when a pathPrefix exists for the server docs', () => {
    const mockSiteBasePrefix = 'docs';
    expect(generateVersionedPrefix('v100', mockSiteBasePrefix)).toBe('/docs/v100');
  });

  it("returns a prefix when the site's base prefix has more than 1 forward slash", () => {
    const mockSiteBasePrefix = 'docs/atlas/cli';
    expect(generateVersionedPrefix('upcoming', mockSiteBasePrefix)).toBe('/docs/atlas/cli/upcoming');
  });

  it('returns a prefix when a urlSlug/version with multiple forward slashes exists', () => {
    const mockSiteBasePrefix = 'docs/realm';
    expect(generateVersionedPrefix('sdk/android/v10.2', mockSiteBasePrefix)).toBe('/docs/realm/sdk/android/v10.2');
  });

  it('returns a prefix when in development with no pathPrefix', () => {
    const mockSiteBasePrefix = 'docs/bi-connector';
    expect(generateVersionedPrefix('v2.15', mockSiteBasePrefix)).toBe('/docs/bi-connector/v2.15');
  });
});
