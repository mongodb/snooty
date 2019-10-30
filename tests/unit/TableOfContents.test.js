import React from 'react';
import { mount, shallow } from 'enzyme';
import mockTocData from './data/Table-Of-Contents.test.json';
import TableOfContents from '../../src/components/TableOfContents';
/*
  Test render
  Test number of sections/children
  Test drawer specs
  Test options/styles
  Test links
*/

const mountedToc = mockData => mount(<TableOfContents toctreeData={mockData} />);
const shallowToc = mockData => shallow(<TableOfContents toctreeData={mockData} />);

describe('Table of Contents testing', () => {
  describe('Table of Contents unit tests', () => {
    let testComponent;
    let testShallowComponent;

    const remountTOC = () => {
      testComponent = mountedToc(mockTocData);
    };

    const updatePageLocation = (title, newLocation) => {
      window.history.pushState({}, title, newLocation);
      remountTOC();
    };

    beforeAll(() => {
      testShallowComponent = shallowToc(mockTocData);
    });

    beforeEach(() => {
      updatePageLocation('Ecosystem', '/');
      remountTOC();
    });

    it('renders correctly', () => {
      expect(testShallowComponent).toMatchSnapshot();
    });

    it('TOC exists with proper number of sections and nodes per section', () => {
      expect(window.location.pathname).toBe('/');
      // Child list of sections
      expect(testComponent.find('ul.current')).toHaveLength(1);
      // Child sections themselves
      expect(testComponent.find('ul li.toctree-l1')).toHaveLength(4);
      // Number in section
      expect(testComponent.find('.toctree-l2')).toHaveLength(0);
      updatePageLocation('Drivers', '/drivers');
      expect(window.location.pathname).toBe('/drivers');
      const numDriverNodes = mockTocData.children[0].children.length;
      expect(testComponent.find('.toctree-l2')).toHaveLength(numDriverNodes);
    });

    describe('TOC navigation should render and work as expected', () => {
      it('TOC slugs work as expected', () => {
        expect(window.location.pathname).toBe('/');
        const testTOCLink = testComponent.find('ul li.toctree-l1 .reference').first();
        expect(testTOCLink.hasClass('internal')).toBe(true);
        expect(testTOCLink.prop('to')).toBe('/drivers');
        expect(testComponent.find('.toctree-l2')).toHaveLength(0);
        updatePageLocation('Drivers', '/drivers');
        expect(window.location.pathname).toBe('/drivers');
        const numDriverNodes = mockTocData.children[0].children.length;
        expect(testComponent.find('.toctree-l2')).toHaveLength(numDriverNodes);
      });

      it('TOC external navigation (urls) should work as expected', () => {
        updatePageLocation('Tools', '/tools');
        const biConnectorLink = testComponent
          .find('.toctree-l2')
          .first()
          .find('.reference');
        expect(biConnectorLink.hasClass('external')).toBe(true);
        expect(biConnectorLink.prop('href')).toBe('https://docs.mongodb.com/bi-connector/current/');
      });
    });

    describe('TOC options work as expected', () => {
      it('TOC supports a drawer option', () => {
        // Platforms section is a drawer, check clicking it does not redirect and opens those options
        expect(testComponent.find('.toctree-l2')).toHaveLength(0);
        const drawer = testComponent
          .find('.toctree-l1')
          .last()
          .find('.reference');
        // Drawers should not redirect to a page, so href should be undefined
        expect(drawer.prop('href')).toBe(undefined);
        drawer.simulate('click');
        const numUseCasesNodes = mockTocData.children[3].children.length;
        expect(testComponent.find('.toctree-l2')).toHaveLength(numUseCasesNodes);
        expect(window.location.pathname).toBe('/');
        const otherDrawer = testComponent
          .find('.toctree-l1')
          .at(2)
          .find('.reference');
        otherDrawer.simulate('click');
        const numPlatformNodes = mockTocData.children[2].children.length;
        expect(testComponent.find('.toctree-l2')).toHaveLength(numPlatformNodes);
      });

      it('TOC supports a style option', () => {
        const strongLink = testComponent
          .find('.toctree-l1')
          .last()
          .find('.reference');
        const numTOCSections = mockTocData.children.length;
        const lastSection = mockTocData.children[numTOCSections - 1];
        expect(lastSection.title).toBe('Use Cases');
        expect(lastSection.options).toBeDefined();
        expect(lastSection.options.styles).toBeDefined();
        const expectedInnerStyle = '<strong>Use Cases</strong>';
        expect(strongLink.html().includes(expectedInnerStyle)).toBeTruthy();
      });
    });
  });
});
