import { generatePathPrefix } from '../../../src/utils/generate-path-prefix';

describe('path prefix testing', () => {
  const commitHash = 'COMMIT_HASH';
  const parserBranch = 'PARSER_BRANCH';
  const patchId = 'PATCH_ID';
  const project = 'PROJECT';
  const snootyBranch = 'SNOOTY_BRANCH';
  const user = 'USER';
  const pathPrefix = 'PATH_PREFIX';
  const pathPrefixSlash = '/PATH_PREFIX_SLASH';
  const siteMetadata = {
    parserBranch,
    project,
    snootyBranch,
    user,
  };

  expect(process.env.GATSBY_SNOOTY_DEV).toBeUndefined();
  let prefix;

  it('should generate a prefix when none is provided', () => {
    prefix = generatePathPrefix(siteMetadata);
    expect(prefix).toBe(`/${project}/${user}/${parserBranch}`);
  });

  describe('when using developer mode', () => {
    beforeAll(() => {
      process.env.GATSBY_SNOOTY_DEV = true;
    });

    afterAll(() => {
      delete process.env.GATSBY_SNOOTY_DEV;
    });

    it('should generate a different prefix if GATSBY_SNOOTY_DEV is enabled', () => {
      expect(process.env.GATSBY_SNOOTY_DEV).toBe('true');
      prefix = generatePathPrefix(siteMetadata);
      expect(prefix).toBe(`/${parserBranch}/${project}/${user}/${snootyBranch}`);
    });
  });

  it('should included the commit hash, if specified', () => {
    expect(process.env.GATSBY_SNOOTY_DEV).toBeUndefined();
    siteMetadata.commitHash = commitHash;
    prefix = generatePathPrefix(siteMetadata);
    expect(prefix).toBe(`/${commitHash}/${project}/${user}/${parserBranch}`);
  });

  it('should included the patch ID, if specified', () => {
    siteMetadata.patchId = patchId;
    prefix = generatePathPrefix(siteMetadata);
    expect(prefix).toBe(`/${commitHash}/${patchId}/${project}/${user}/${parserBranch}`);
  });

  describe('when using a defined path prefix vairable', () => {
    it('should prepend a slash if the variable does not include one', () => {
      siteMetadata.pathPrefix = pathPrefix;
      prefix = generatePathPrefix(siteMetadata);
      expect(prefix).toBe(`/${pathPrefix}`);
    });

    it('should not prepend an additional slash', () => {
      siteMetadata.pathPrefix = pathPrefixSlash;
      prefix = generatePathPrefix(siteMetadata);
      expect(prefix).toBe(pathPrefixSlash);
    });
  });
});
