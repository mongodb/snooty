import React from 'react';
import { render } from '@testing-library/react';
import BreadcrumbContainer from '../../src/components/Breadcrumbs/BreadcrumbContainer';
import { NavigationContext } from '../../src/context/navigation-context';

const mountBreadcrumbContainer = (homeCrumb, lastCrumb, parents) => {
  return render(
    <NavigationContext.Provider value={{ parents }}>
      <BreadcrumbContainer homeCrumb={homeCrumb} lastCrumb={lastCrumb} />
    </NavigationContext.Provider>
  );
};

describe('BreadcrumbContainer', () => {
  const mockHomeCrumb = {
    title: 'Docs Home',
    url: 'https://www.mongodb.com/docs/',
  };

  it('renders correctly with project parent', () => {
    const mockLastCrumb = {
      title: 'MongoDB Compass',
      url: 'documents/view',
    };

    const mockParents = [
      {
        title: 'View & Analyze',
        url: 'https://www.mongodb.com/docs/view-analyze',
      },
    ];

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockLastCrumb, mockParents);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders correctly without project parent', () => {
    const mockLastCrumb = {
      title: 'View & Analyze Data',
      url: 'view-analyze',
    };

    const tree = mountBreadcrumbContainer(mockHomeCrumb, mockLastCrumb, []);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
