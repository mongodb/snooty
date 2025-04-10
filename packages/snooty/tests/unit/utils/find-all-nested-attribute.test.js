import { findAllNestedAttribute } from '../../../src/utils/find-all-nested-attribute';
import figureData from '../data/Figure.test.json';
import headingData from '../data/Heading.test.json';
import footnoteData from '../data/Footnote.test.json';

describe('findAllNestedAttribute', () => {
  it('gets all attribute from one level of children', () => {
    const res = findAllNestedAttribute([figureData, headingData, footnoteData], 'id');
    expect(res).toEqual(['create-an-administrative-username-and-password', 'id8']);
  });

  it('gets all attributes from multiple children levels', () => {
    const headingWithChildren = { ...headingData };
    headingWithChildren.children = [headingData, footnoteData];
    const res = findAllNestedAttribute([headingWithChildren], 'type');
    expect(res).toEqual(['heading', 'heading', 'text', 'footnote', 'paragraph', 'text']);
  });
});
