import React from 'react';
import { render } from '@testing-library/react';
import OpenAPI from '../../src/components/OpenAPI';

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

jest.mock('../../src/utils/openapi-spec', () => ({
  fetchOASFile: async () => false,
}));

jest.mock('redoc', () => {
  return {
    RedocStandalone: (props) => (
      <div>
        <span>Redoc Mock</span>
        <span>{props.specUrl}</span>
      </div>
    ),
  };
});

const shallowRender = ({ nodeValue, usesRealm = false, usesRst = false }) => {
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
        },
      }}
    />
  );
};

describe('OpenAPI', () => {
  const mockNodeValue = 'includes/cloud-openapi.json';

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
