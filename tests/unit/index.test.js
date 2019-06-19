import React from 'react';
import { shallow } from 'enzyme';
import Index from '../../src/templates/guides-index';

// data for this component
import mockData from './data/index.test.json';

jest.mock('../../src/hooks/use-site-metadata');

describe('Landing Page', () => {
  it('renders correctly', () => {
    const tree = shallow(<Index pageContext={{ __refDocMapping: mockData }} />);
    expect(tree).toMatchSnapshot();
  });
});
