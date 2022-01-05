import React from 'react';
import { mount } from 'enzyme';
import mockData from './data/Chapters.test.json';
import { ContentsContext } from '../../src/components/contents-context';
import GuidesTOCTree from '../../src/components/Sidenav/GuidesTOCTree';

const mockHeadingNodes = [
  { id: 'heading1', title: 'Heading 1' },
  { id: 'heading2', title: 'Heading 2' },
  { id: 'heading3', title: 'Heading 3' },
];

const getWrapper = ({ currentSlug }) => {
  const { chapters, guides } = mockData.metadata;

  return mount(
    <ContentsContext.Provider value={{ headingNodes: mockHeadingNodes }}>
      <GuidesTOCTree chapters={chapters} guides={guides} slug={currentSlug} />
    </ContentsContext.Provider>
  );
};

it('renders with correct active slug', () => {
  const currentSlug = 'cloud/account';
  const wrapper = getWrapper({ currentSlug });

  // Contains 3 guides in the same chapter + 3 headings
  expect(wrapper.find('SideNavItem')).toHaveLength(6);

  const activeItem = wrapper.findWhere((n) => n.is('SideNavItem') && n.prop('active') === true);
  expect(activeItem).toHaveLength(1);
  expect(activeItem.prop('to')).toEqual(currentSlug);
});
