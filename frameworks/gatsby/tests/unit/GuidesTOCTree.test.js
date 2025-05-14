import React from 'react';
import { render } from '@testing-library/react';
import { mockLocation } from '../utils/mock-location';
import { ContentsContext } from '../../src/components/Contents/contents-context';
import GuidesTOCTree from '../../src/components/Sidenav/GuidesTOCTree';
import mockData from './data/Chapters.test.json';

const mockHeadingNodes = [
  { id: 'heading1', title: 'Heading 1' },
  { id: 'heading2', title: 'Heading 2' },
  { id: 'heading3', title: 'Heading 3' },
];

const getWrapper = ({ currentSlug }) => {
  const { chapters, guides } = mockData.metadata;

  return render(
    <ContentsContext.Provider value={{ headingNodes: mockHeadingNodes }}>
      <GuidesTOCTree chapters={chapters} guides={guides} slug={currentSlug} />
    </ContentsContext.Provider>
  );
};

beforeAll(() => {
  mockLocation(null, `/`);
});

it('renders with correct active slug', () => {
  const currentSlug = 'cloud/account';
  const wrapper = getWrapper({ currentSlug });

  // Contains 3 guides in the same chapter + 3 headings
  expect(wrapper.queryAllByRole('link')).toHaveLength(6);

  const activeItem = wrapper.getByRole('link', { current: 'page' });
  expect(activeItem).toHaveAttribute('href', `/${currentSlug}/`);
});
