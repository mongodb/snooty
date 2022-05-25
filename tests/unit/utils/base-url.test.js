import { baseUrl } from '../../../src/utils/base-url';

describe('baseUrl', () => {
  it('by default returns the DOTCOM_BASE_URL with protocols and prefix, with a trailing slash', () => {
    expect(baseUrl()).toBe('https://www.mongodb.com/docs/');
  });

  it('supports returning a url without the https:// protocol when options.needsProtocol is falsey', () => {
    expect(baseUrl('https://docs.mongodb.com', { needsProtocol: false })).toBe('www.mongodb.com/docs/');
  });

  it('supports returning a url without a prefix when options.needsPrefix is falsey', () => {
    expect(baseUrl('https://docs.mongodb.com', { needsPrefix: false })).toBe('https://www.mongodb.com/');
  });

  it('supports both regular subdomain and product subdomain conversions', () => {
    expect(baseUrl('https://docs.mongodb.com')).toBe('https://www.mongodb.com/docs/');
    expect(baseUrl('https://docs.atlas.mongodb.com')).toBe('https://www.mongodb.com/docs/atlas/');
  });

  it('supports mapping products to prefixes in special cases, aka opsmanager -> ops-manager ', () => {
    expect(baseUrl('https://docs.opsmanager.mongodb.com')).toBe('https://www.mongodb.com/docs/ops-manager/');
    expect(baseUrl('https://docs.cloudmanager.mongodb.com')).toBe('https://www.mongodb.com/docs/cloud-manager/');
  });

  it('supports conversions with pathname combinations, and handles `com` in pathname', () => {
    // single level subdomain
    expect(baseUrl('https://docs.mongodb.com')).toBe('https://www.mongodb.com/docs/');
    expect(baseUrl('https://docs.mongodb.com/long-path/name/divided/by-many-paths')).toBe(
      'https://www.mongodb.com/docs/long-path/name/divided/by-many-paths/'
    );
    expect(baseUrl('https://docs.mongodb.com/compound-indexes')).toBe('https://www.mongodb.com/docs/compound-indexes/');

    // product subdomains
    expect(baseUrl('https://docs.opsmanager.mongodb.com/this-is/a-long/pathname')).toBe(
      'https://www.mongodb.com/docs/ops-manager/this-is/a-long/pathname/'
    );
    expect(baseUrl('https://docs.opsmanager.mongodb.com/combine-results')).toBe(
      'https://www.mongodb.com/docs/ops-manager/combine-results/'
    );
  });

  it('supports conversions with versions and aliases', () => {
    // single level subdomain
    expect(baseUrl('https://docs.mongodb.com/v1.2.3/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/v1.2.3/compound-indexes/'
    );
    expect(baseUrl('https://docs.mongodb.com/upcoming/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/upcoming/compound-indexes/'
    );

    // product subdomains
    expect(baseUrl('https://docs.opsmanager.mongodb.com/upcoming/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/ops-manager/upcoming/compound-indexes/'
    );
    expect(baseUrl('https://docs.opsmanager.mongodb.com/v1.5/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/ops-manager/v1.5/compound-indexes/'
    );
  });

  it('handles urls gracefully when the baseUrl is already present', () => {
    expect(baseUrl('https://www.mongodb.com/docs/ops-manager/v1.5/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/ops-manager/v1.5/compound-indexes/'
    );

    expect(baseUrl('https://www.mongodb.com/docs/long-path/name/divided/by-many-paths')).toBe(
      'https://www.mongodb.com/docs/long-path/name/divided/by-many-paths/'
    );
  });

  it('attaches prefixes to urls missing a prefix', () => {
    expect(baseUrl('https://www.mongodb.com/long-path/name/divided/by-many-paths')).toBe(
      'https://www.mongodb.com/docs/long-path/name/divided/by-many-paths/'
    );
  });

  it('handles no subdomain gracefully, and appends a www subdomain', () => {
    expect(baseUrl('https://mongodb.com/docs/alas-I-have-no-subdomain')).toBe(
      'https://www.mongodb.com/docs/alas-I-have-no-subdomain/'
    );

    expect(baseUrl('https://alas-I-am-not-mdb.com/docs')).toBe('https://www.mongodb.com/docs/');
  });

  it('fails gracefully if passed an invalid url', () => {
    expect(baseUrl('alas I am but a random string')).toBe('https://www.mongodb.com/docs/');
  });
});
