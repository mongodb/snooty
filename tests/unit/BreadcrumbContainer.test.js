import React from 'react';
import { mount } from 'enzyme';
import BreadcrumbContainer from '../../src/components/BreadcrumbContainer';
import { NavigationContext } from '../../src/components/navigation-context';

const mountBreadcrumbContainer = (homeCrumb, lastCrumb, parents) =>
  mount(
    <NavigationContext.Provider value={{ parents }}>
      <BreadcrumbContainer homeCrumb={homeCrumb} lastCrumb={lastCrumb} />
    </NavigationContext.Provider>
  );

describe('BreadcrumbContainer', () => {
  const mockHomeCrumb = {
    title: 'Docs Home',
    url: 'https://docs.mongodb.com/',
  };

  it('renders correctly with project parent', () => {
    const mockLastCrumb = {
      title: 'MongoDB Compass',
      url: 'documents/view',
    };

    const mockParents = [
      {
        title: 'View & Analyze',
        url: 'https://docs.mongodb.com/view-analyze',
      },
    ];

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockLastCrumb, mockParents);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without project parent', () => {
    const mockLastCrumb = {
      title: 'View & Analyze Data',
      url: 'view-analyze',
    };

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockLastCrumb, []);
    expect(tree).toMatchSnapshot();
  });
});
