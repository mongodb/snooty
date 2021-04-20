import React from 'react';
import { mount } from 'enzyme';
import BreadcrumbContainer from '../../src/components/BreadcrumbContainer';
import * as StitchUtil from '../../src/utils/stitch';
import { tick } from '../utils';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({
    database: 'snooty_dev',
    project: 'test',
  }),
}));

describe('BreadcrumbContainer', () => {
  jest.useFakeTimers();

  it('renders correctly with project parent', async () => {
    const mockLastCrumb = {
      title: 'MongoDB Compass',
      url: 'documents/view',
    };
    jest.spyOn(StitchUtil, 'fetchProjectParents').mockImplementation(() => [
      {
        title: 'View & Analyze',
        url: 'https://docs.mongodb.com/view-analyze',
      },
    ]);

    const tree = mount(<BreadcrumbContainer lastCrumb={mockLastCrumb} />);
    await tick({ wrapper: tree });
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without project parent', async () => {
    const mockLastCrumb = {
      title: 'View & Analyze Data',
      url: 'view-analyze',
    };
    jest.spyOn(StitchUtil, 'fetchProjectParents').mockImplementation(() => []);

    const tree = mount(<BreadcrumbContainer lastCrumb={mockLastCrumb} />);
    await tick({ wrapper: tree });
    expect(tree).toMatchSnapshot();
  });
});
