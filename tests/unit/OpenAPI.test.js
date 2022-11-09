import React from 'react';
import { render } from '@testing-library/react';
import OpenAPI from '../../src/components/OpenAPI';
import { OpenAPIContextProvider } from '../../src/components/OpenAPI/openapi-context';
import testSpecStore from './data/OpenAPI.test.json';

const mockSpecJson = {
  openapi: '3.0.0',
  info: {
    version: '1.0.5',
    title: 'Swagger Petstore',
  },
  paths: {},
};

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ database: 'snooty_dev' }),
}));

jest.mock('../../src/utils/realm', () => ({
  fetchOASFile: async () => false,
}));

// Mock Redoc's implementation as internal components may be difficult to load in our testing
// environment, or they may be undefined.
jest.mock('redoc', () => {
  return {
    RedocStandalone: (props) => (
      <div>
        <span>Redoc Mock</span>
        <span>{props.specUrl}</span>
      </div>
    ),
    Redoc: () => (
      <div>
        <span>Redoc Static Mock</span>
      </div>
    ),
    AppStore: {
      fromJS: (store) => ({
        spec: {
          data: store.spec,
        },
      }),
    },
  };
});

const shallowRender = ({ nodeValue, store, usesRealm = false, usesRst = false, preview = true }) => {
  let mockChildren = [];
  if (!usesRealm) {
    mockChildren = [
      {
        type: 'text',
        value: JSON.stringify(mockSpecJson),
      },
    ];
  }

  return render(
    <OpenAPIContextProvider store={store}>
      <OpenAPI
        metadata={{
          title: 'Atlas',
        }}
        nodeData={{
          argument: [
            {
              type: 'text',
              value: nodeValue,
            },
          ],
          children: mockChildren,
          options: {
            'uses-realm': usesRealm,
            'uses-rst': usesRst,
            preview: preview,
          },
        }}
      />
    </OpenAPIContextProvider>
  );
};

describe('OpenAPI', () => {
  const mockNodeValue = 'includes/cloud-openapi.json';

  describe('Client-side OpenAPI component', () => {
    it('renders with a parsed spec file', () => {
      const wrapper = shallowRender({ nodeValue: mockNodeValue });
      expect(wrapper.getByText('Redoc Mock')).toBeTruthy();
    });

    it('renders loading widget before fetching spec file from Realm', async () => {
      // Used shallow for this test to avoid errors from mounting the Redoc component
      const wrapper = shallowRender({
        nodeValue: 'cloud',
        usesRealm: true,
      });
      expect(wrapper.getByText('Loading')).toBeTruthy();
    });

    it('uses rST to render our custom components', () => {
      const wrapper = shallowRender({
        nodeValue: mockNodeValue,
        usesRst: true,
      });
      expect(
        wrapper.getByText('{"openapi":"3.0.0","info":{"version":"1.0.5","title":"Swagger Petstore"},"paths":{}}')
      ).toBeTruthy();
    });

    it('passes `src` param into the specUrl prop for the Redoc standalone component', () => {
      global.window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          search: `?src=https://raw.githubusercontent.com`,
        },
        writable: true,
      });

      const wrapper = shallowRender({
        nodeValue: mockNodeValue,
      });

      expect(wrapper.getByText('https://raw.githubusercontent.com')).toBeTruthy();
    });
  });

  describe('Static OpenAPI component', () => {
    it('renders successfully', () => {
      const wrapper = shallowRender({
        preview: false,
        store: testSpecStore,
      });
      expect(wrapper.getByText('Redoc Static Mock')).toBeTruthy();
    });

    it('gracefully fails to render on nonexistent spec', () => {
      const wrapper = shallowRender({
        preview: false,
      });
      // No children should be rendered if spec does not exist.
      expect(wrapper.asFragment().childElementCount).toBe(0);
    });
  });
});
