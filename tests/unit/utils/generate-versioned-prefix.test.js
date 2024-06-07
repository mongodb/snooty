import { generateVersionedPrefix } from '../../../src/utils/generate-versioned-prefix';

describe('generateVersionedPrefix', () => {
  it('returns a prefix for a versioned docs site', () => {
    const mockSiteBasePrefix = 'docs/bi-connector';
    expect(generateVersionedPrefix('v2.15', mockSiteBasePrefix)).toBe('/docs/bi-connector/v2.15');
  });

  it("returns a prefix when the site's base prefix has more than 1 forward slash", () => {
    const mockSiteBasePrefix = 'docs/atlas/cli';
    expect(generateVersionedPrefix('upcoming', mockSiteBasePrefix)).toBe('/docs/atlas/cli/upcoming');
  });

  it('returns a prefix when a urlSlug/version with multiple forward slashes exists', () => {
    const mockSiteBasePrefix = 'docs/realm';
    expect(generateVersionedPrefix('sdk/android/v10.2', mockSiteBasePrefix)).toBe('/docs/realm/sdk/android/v10.2');
  });
});
