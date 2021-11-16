import React from 'react';
import { mount } from 'enzyme';
import mockData from './data/Chapters.test.json';
import Chapter from '../../src/components/Chapters/Chapter';

it('renders correctly', () => {
  const chapterData = mockData.nodeData.children[0];
  const wrapper = mount(<Chapter nodeData={chapterData} metadata={mockData.metadata} />);
  expect(wrapper).toMatchSnapshot();

  // Make sure that the logic used to get the component's rendered data is correct
  expect(wrapper.find('ChapterNumberLabel').text()).toEqual('Chapter 1');
  expect(wrapper.find('ChapterTitle').text()).toEqual('Atlas');
  expect(wrapper.find('GuidesListItem')).toHaveLength(3);
});
