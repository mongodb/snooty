import fetch from 'node-fetch';
import { constructOpenAPIPageMapping } from '../../../../src/utils/setup/construct-openapi-page-mapping';

// Minimally-mocked store expected from Redoc. Values are hardcoded for simplicity,
// but Redoc should return more accurate objects.
class MockedStore {
  constructor() {
    this.spec = {
      data: {
        info: 'Example Spec',
      },
    };
    this.search = {
      searchWorker: {
        dispose: () => {},
      },
    };
  }

  toJS() {
    return { spec: this.spec };
  }
}

// Issues with search worker used in Redoc's implementation being undefined in
// our testing environment. Mock the AppStore object as a workaround.
jest.mock('redoc', () => ({
  createStore: () => new MockedStore(),
}));

// Mock node-fetch to provide default/minimal values.
jest.mock('node-fetch');
fetch.mockImplementation(() => ({
  ok: true,
  text: () => '{}',
}));

// Mocked OpenAPI content pages. Empty sources are okay since we mock the functions
// that require actual spec content
const OPENAPI_PAGES_METADATA = {
  'path/to/page/local': {
    source_type: 'local',
    source: '{}',
  },
  'path/to/page/url': {
    source_type: 'url',
    source: '{}',
  },
  'path/to/page/atlas': {
    source_type: 'atlas',
    source: 'cloud',
  },
};

describe('constructOpenAPIPageMapping', () => {
  it('creates a mapping based on expected source types', async () => {
    const mapping = await constructOpenAPIPageMapping(OPENAPI_PAGES_METADATA);
    const mappingEntries = Object.entries(mapping);
    expect(mappingEntries).toHaveLength(3);
    for (const entry of mappingEntries) {
      const pageData = entry[1];
      expect(pageData.spec.data.info).toBeTruthy();
    }
  });

  it('throws error on unsupported custom API sourcing', async () => {
    const testMetadata = {
      'path/to/page/atlas': {
        source_type: 'atlas',
        source: 'not-cloud',
      },
    };
    await expect(constructOpenAPIPageMapping(testMetadata)).rejects.toThrow(
      'not-cloud is not a supported API for building.'
    );
  });
});
