import { dotcomifyUrl, isDotCom, baseUrl } from '../../../src/utils/dotcom';

describe('dotcomifyUrl', () => {
  it('by default returns a url with protocols and prefix', () => {
    expect(dotcomifyUrl('https://docs.mongodb.com')).toBe('https://www.mongodb.com/docs');
  });

  it('supports returning a url without the https:// protocol when options.needsProtocol is falsey', () => {
    expect(dotcomifyUrl('https://docs.mongodb.com', { needsProtocol: false })).toBe('www.mongodb.com/docs');
  });

  it('supports returning a url without a prefix when options.needsPrefix is falsey', () => {
    expect(dotcomifyUrl('https://docs.mongodb.com', { needsPrefix: false })).toBe('https://www.mongodb.com');
  });

  it('supports both regular subdomain and product subdomain conversions', () => {
    expect(dotcomifyUrl('https://docs.mongodb.com')).toBe('https://www.mongodb.com/docs');
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com')).toBe('https://www.mongodb.com/docs/ops-manager');
    expect(dotcomifyUrl('https://docs.atlas.mongodb.com')).toBe('https://www.mongodb.com/docs/atlas');
  });

  it('supports mapping products to prefixes in special cases, ala opsmanager -> ops-manager ', () => {
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com')).toBe('https://www.mongodb.com/docs/ops-manager');
  });

  it('supports conversions with pathname combinations, and handles `com` in pathname', () => {
    // single level subdomain
    expect(dotcomifyUrl('https://docs.mongodb.com')).toBe('https://www.mongodb.com/docs');
    expect(dotcomifyUrl('https://docs.mongodb.com/long-path/name/divided/by-many-paths')).toBe(
      'https://www.mongodb.com/docs/long-path/name/divided/by-many-paths'
    );
    expect(dotcomifyUrl('https://docs.mongodb.com/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/compound-indexes'
    );

    // product subdomains
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com')).toBe('https://www.mongodb.com/docs/ops-manager');
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com/this-is/a-long/pathname')).toBe(
      'https://www.mongodb.com/docs/ops-manager/this-is/a-long/pathname'
    );
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com/combine-results')).toBe(
      'https://www.mongodb.com/docs/ops-manager/combine-results'
    );
  });

  it('supports conversions with versions and aliases', () => {
    // single level subdomain
    expect(dotcomifyUrl('https://docs.mongodb.com/v1.2.3/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/v1.2.3/compound-indexes'
    );
    expect(dotcomifyUrl('https://docs.mongodb.com/upcoming/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/upcoming/compound-indexes'
    );

    // product subdomains
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com/upcoming/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/ops-manager/upcoming/compound-indexes'
    );
    expect(dotcomifyUrl('https://docs.opsmanager.mongodb.com/v1.5/compound-indexes')).toBe(
      'https://www.mongodb.com/docs/ops-manager/v1.5/compound-indexes'
    );
  });
});

describe('isDotCom', () => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'docs.mongodb.com',
    },
    writable: true,
  });

  describe('attempts to assert state on whether a property is a dotCom instance', () => {
    it('returns false in docs.*.mongodb.com instances', () => {
      expect(isDotCom()).not.toBeTruthy();
    });

    it('returns true when invoked on ANY www. subdomain, not just /docs routes', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'www.mongodb.com',
        },
        writeable: true,
      });
      expect(isDotCom()).toBeTruthy();
    });
  });
});

describe('baseUrl', () => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'docs.mongodb.com',
    },
    writable: true,
  });

  describe('is a function which attempts return an appropriate baseUrl at invocation time based on environment state.', () => {
    it('determines dotcom vs. docs. based on subdomain when invoked', () => {
      process.env = {};
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'www.mongodb.com',
        },
        writeable: true,
      });

      expect(baseUrl()).toBe('www.mongodb.com/docs');

      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'docs.mongodb.com',
        },
        writable: true,
      });
      expect(baseUrl()).toBe('docs.mongodb.com');
    });

    it('supports a protocol boolean flag', () => {
      process.env = {};
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'docs.mongodb.com',
        },
        writable: true,
      });
      expect(baseUrl(true)).toBe('https://docs.mongodb.com');
    });
  });
});
