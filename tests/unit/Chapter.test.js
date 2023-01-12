import React from 'react';
import { render } from '@testing-library/react';
import Chapter from '../../src/components/Chapters/Chapter';
import mockData from './data/Chapters.test.json';

it('renders correctly', () => {
  const chapterData = mockData.nodeData.children[0];
  const wrapper = render(<Chapter nodeData={chapterData} metadata={mockData.metadata} />);
  expect(wrapper.asFragment()).toMatchSnapshot();

  // Make sure that the logic used to get the component's rendered data is correct
  expect(wrapper.getByText('Chapter 1')).toBeTruthy();
  expect(wrapper.getByText('Atlas')).toBeTruthy();
  expect(wrapper.container.querySelectorAll('li')).toHaveLength(3);
});
