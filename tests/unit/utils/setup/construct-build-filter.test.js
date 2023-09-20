import { constructBuildFilter } from '../../../../src/utils/setup/construct-build-filter';

// Mock page documents found in snooty_<db>.documents
const mockPageDocs = [
  { page_id: 'test-repo/test-user/master/index.txt' },
  { page_id: 'test-repo/test-user/master/about.txt' },
  { page_id: 'test-repo/test-user/master/page.txt' },
  { page_id: 'test-repo/test-user/master-copy/copy.txt' },
  { page_id: 'test-repo/test-user/beepboop' },
  // With commit hashes and/or patch ids
  { page_id: 'test-repo/test-user/master/index.txt', commit_hash: '1', patch_id: 'a' },
  { page_id: 'test-repo/test-user/master-copy/index.txt', commit_hash: '1' },
  { page_id: 'test-repo/test-user/master-copy/about.txt', commit_hash: '1', patch_id: 'a' },
  { page_id: 'test-repo/test-user/master-copy/page.txt', commit_hash: '2', patch_id: 'b' },
];

// Mock documents found in snooty_<db>.metadata
const mockMetadataDocs = [
  { page_id: 'test-repo/test-user/master' },
  { page_id: 'test-repo/test-user/master', patch_id: 'a' },
  { page_id: 'test-repo/test-user/master-copy' },
  { page_id: 'test-repo/test-user/beepboop' },
];

// Mock MongoDB query/filter for documents
const docsFilter = (buildFilter) => {
  const checkForMatchOrExists = (key, doc) => {
    if (typeof buildFilter[key] === 'string') {
      return buildFilter[key] === doc[key];
    } else {
      // $exists: false
      return !doc.hasOwnProperty(key);
    }
  };

  return (doc) => {
    const pageIdMatch = doc.page_id.match(buildFilter.page_id['$regex'])?.length > 0;
    const commitHashMatch = checkForMatchOrExists('commit_hash', doc);
    const patchIdMatch = checkForMatchOrExists('patch_id', doc);
    return pageIdMatch && commitHashMatch && patchIdMatch;
  };
};

describe('constructBuildFilter', () => {
  it('returns documents without commit hashes or patch ids', () => {
    process.env.GATSBY_SITE = 'test-repo';
    const sitemetadata = {
      project: 'test-repo',
      parserUser: 'test-user',
      parserBranch: 'master',
    };
    const buildFilter = constructBuildFilter(sitemetadata);
    let filteredResults = mockPageDocs.filter(docsFilter(buildFilter));
    expect(filteredResults).toHaveLength(3);

    filteredResults = mockMetadataDocs.filter(docsFilter(buildFilter));
    expect(filteredResults).toHaveLength(1);
  });

  it('returns documents with commit hash and patch id', () => {
    process.env.GATSBY_SITE = 'test-repo';
    const sitemetadata = {
      project: 'test-repo',
      parserUser: 'test-user',
      parserBranch: 'master-copy',
      commitHash: '1',
      patchId: 'a',
    };

    const buildFilter = constructBuildFilter(sitemetadata);
    let filteredResults = mockPageDocs.filter(docsFilter(buildFilter));
    expect(filteredResults).toHaveLength(1);

    filteredResults = mockMetadataDocs.filter(docsFilter(buildFilter));
    expect(filteredResults).toHaveLength(0);
  });
});
