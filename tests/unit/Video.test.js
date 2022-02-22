import React from 'react';
import { render } from '@testing-library/react';
import Video from '../../src/components/Video/Video';

// data for this component
import mockData from './data/Video.test.json';

it('Video renders correctly', () => {
  const tree = render(<Video nodeData={mockData} />);
  expect(tree.asFragment()).toMatchSnapshot();
});
