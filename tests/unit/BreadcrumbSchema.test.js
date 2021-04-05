import React from 'react';
import { shallow } from 'enzyme';
import BreadcrumbSchema from '../../src/components/BreadcrumbSchema';

import mockData from './data/Breadcrumbs.test.json';

const siteUrl = 'https://docs.mongodb.com';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ siteUrl }),
}));

describe('BreadcrumbSchema', () => {
  let shallowWrapper;

  beforeAll(() => {
    shallowWrapper = shallow(<BreadcrumbSchema breadcrumb={mockData} siteTitle="MongoDB Compass" />);
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('script has a correct schema', () => {
    const script = shallowWrapper.find('script');

    expect(script.text()).toEqual(
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'MongoDB Compass', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Interact with Your Data', item: `${siteUrl}/manage-data/` },
          { '@type': 'ListItem', position: 3, name: 'Manage Documents', item: `${siteUrl}/documents/` },
        ],
      })
    );
  });
});
