import React from 'react';
import { render } from '@testing-library/react';
import CommunityPillLink from '../../src/components/CommunityPillLink';

// data for this component
import mockData from './data/CommunityPillLink.test.json';

it('community drivers directives render correctly', () => {
  const tree = render(<CommunityPillLink nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
