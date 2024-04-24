import React from 'react';
import { render } from '@testing-library/react';
import BreadcrumbContainer from '../../src/components/Breadcrumbs/BreadcrumbContainer';
import mockData from './data/Breadcrumbs.test.json';

const mountBreadcrumbContainer = (breadcrumbs) => {
  return render(<BreadcrumbContainer breadcrumbs={breadcrumbs} />);
};

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

describe('BreadcrumbContainer', () => {
  //home breadcrumb
  const mockHomeCrumb = {
    title: 'Docs Home',
    url: 'https://www.mongodb.com/docs',
  };

  //property breadcrumb
  const mockPropertyCrumb = {
    title: 'MongoDB Atlas Device SDKs',
    url: '/',
  };

  const mockIntermediateCrumbs = {
    title: 'MongoDB Atlas',
    url: '/docs/atlas/',
  };

  const mockParents = mockData['sdk/cpp/app-services/call-a-function'];

  it('renders correctly with intermediate breadcrumb and with project parents', () => {
    const breadcrumbs = [
      { title: 'Docs Home', url: 'https://www.mongodb.com/docs/' },
      { title: 'Languages', url: 'http://www.mongodb.com/docs/languages' },
      { title: 'C#', url: 'http://www.mongodb.com/docs/languages/csharp' },
      { title: 'C#/.NET', url: 'https://www.mongodb.com/docs/csharp/current/' },
      { title: 'Usage Examples', url: 'https://www.mongodb.com/docs/csharp/current/usage-examples' },
    ];

    const tree = mountBreadcrumbContainer(breadcrumbs);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with intermediate breadcrumb, no project parents', () => {
    const tree = mountBreadcrumbContainer([mockHomeCrumb, mockIntermediateCrumbs, mockPropertyCrumb]);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with no intermediate breadcrumb, has project parents', () => {
    const tree = mountBreadcrumbContainer([mockHomeCrumb, mockPropertyCrumb, ...mockParents]);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});

//can do 2 more tests here for something without intermediate breadcrumbs
//test it with parents, and without
