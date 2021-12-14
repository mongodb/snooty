import React from 'react';
import { shallow } from 'enzyme';
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

  return shallow(
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
  const selectors = {
    cFactory: 'ComponentFactory',
    loading: 'LoadingWidget',
    redoc: 'RedocStandalone',
  };
  const mockNodeValue = 'includes/cloud-openapi.json';

  it('renders with a parsed spec file', () => {
    const wrapper = shallowRender({ nodeValue: mockNodeValue });
    expect(wrapper.find(selectors.cFactory)).toHaveLength(0);
    expect(wrapper.find(selectors.loading)).toHaveLength(0);
    const redocComponent = wrapper.find(selectors.redoc);
    expect(redocComponent).toHaveLength(1);
    expect(redocComponent.prop('spec')).toEqual(mockSpecJson);
  });

  it('renders loading widget before fetching spec file from Realm', async () => {
    // Used shallow for this test to avoid errors from mounting the Redoc component
    const wrapper = shallowRender({
      nodeValue: 'cloud',
      usesRealm: true,
    });
    expect(wrapper.find(selectors.cFactory)).toHaveLength(0);
    expect(wrapper.find(selectors.loading)).toHaveLength(1);
    // Testing fetching the spec and loading the contents properly may be better off
    // as an E2E test in the future
    expect(wrapper.find(selectors.redoc)).toHaveLength(0);
  });

  it('uses rST to render our custom components', () => {
    const wrapper = shallowRender({
      nodeValue: mockNodeValue,
      usesRst: true,
    });
    expect(wrapper.find(selectors.cFactory)).toHaveLength(1);
    expect(wrapper.find(selectors.loading)).toHaveLength(0);
    expect(wrapper.find(selectors.redoc)).toHaveLength(0);
  });
});
