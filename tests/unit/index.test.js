import React from 'react';
import { render } from 'enzyme';
import Index from '../../src/templates/guides-index';

// data for this component
import mockData from './data/index.test.json';
import mockPageMetadata from './data/guidesPageMetadata.json';

jest.mock('../../src/hooks/use-site-metadata');

describe('Landing Page', () => {
  // TODO: DOCSP-6123: Handle fixing this test. Skip it for now.
  it.skip('renders correctly', () => {
    const tree = render(<Index pageContext={{ __refDocMapping: mockData, pageMetadata: mockPageMetadata }} />);
    expect(tree).toMatchSnapshot();
  });
});