import { isInternalUrl } from '../../../src/utils/is-internal-url';

const runTest = (url, result) => {
  expect(isInternalUrl(url)).toBe(result);
};

describe('when testing docs urls', () => {
  it('should identify relative urls as internal', () => {
    runTest('/install/', true);
  });

  it('should identify Docs urls as internal', () => {
    runTest('http://docs.mongodb.com/', true);
    runTest('https://docs.mongodb.com/manual/installation/', true);
  });

  it('should identify Atlas docs as internal', () => {
    runTest('https://docs.atlas.mongodb.com/organizations-projects/', true);
  });

  it('should identify Cloud Manager docs as internal', () => {
    runTest('https://docs.cloudmanager.mongodb.com', true);
  });

  it('should identify Ops Manager docs as internal', () => {
    runTest('https://docs.opsmanager.mongodb.com/current/', true);
  });
});

describe('when testing non-Docs urls', () => {
  it('should identify them as external', () => {
    runTest('https://google.com', false);
  });

  it('should identify mailto links as external', () => {
    runTest('mailto:docs@mongodb.com', false);
  });

  it('should return true on invalid urls', () => {
    runTest(undefined, true);
  });
});
