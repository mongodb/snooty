import React from 'react';
import { mount, shallow } from 'enzyme';
import LandingPageCards from '../../src/components/LandingPage/LandingPageCards';

import mockRefDocMapping from './data/index.test.json';
import mockRefDocMappingMultiple from './data/indexTwoGuideCategories.test.json';
import mockGuides from './data/LandingPageCards.test.json';

const mountLandingPageCards = ({ guides, refDocMapping }) =>
  mount(<LandingPageCards guides={guides} refDocMapping={refDocMapping} />);

const shallowLandingPageCards = ({ guides, refDocMapping }) =>
  shallow(<LandingPageCards guides={guides} refDocMapping={refDocMapping} />);

describe('LandingPageCards component', () => {
  describe('when mounted with one type of guide', () => {
    let wrapper;
    let shallowWrapper;

    beforeAll(() => {
      wrapper = mountLandingPageCards({ guides: mockGuides, refDocMapping: mockRefDocMapping });
      shallowWrapper = shallowLandingPageCards({ guides: mockGuides, refDocMapping: mockRefDocMapping });
    });

    it('renders correctly', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('only shows one heading', () => {
      expect(wrapper.find('Category')).toHaveLength(3);
      expect(wrapper.find('.guide-category__title')).toHaveLength(1);
    });

    it('shows the correct icon', () => {
      expect(wrapper.find('.guide-category__title--getting-started')).toHaveLength(1);
      expect(wrapper.find('.guide-category__title--use-case')).toHaveLength(0);
      expect(wrapper.find('.guide-category__title--deep-dive')).toHaveLength(0);
    });

    it('shows seven cards', () => {
      expect(wrapper.find('Card')).toHaveLength(7);
    });

    it('shows a set of language pills', () => {
      expect(wrapper.find('ul.guide__pills')).toHaveLength(1);
    });

    it('shows a See More button', () => {
      expect(wrapper.find('.guide__pill--seeall')).toHaveLength(1);
    });

    it('shows 5 pills (4 languages + 1 See More button)', () => {
      expect(wrapper.find('.guide__pill')).toHaveLength(5);
    });
  });

  describe('when mounted with two types of guides', () => {
    let wrapper;
    let shallowWrapper;

    beforeAll(() => {
      wrapper = mountLandingPageCards({ guides: mockGuides, refDocMapping: mockRefDocMappingMultiple });
      shallowWrapper = shallowLandingPageCards({ guides: mockGuides, refDocMapping: mockRefDocMappingMultiple });
    });

    it('renders correctly', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('only shows one heading', () => {
      expect(wrapper.find('Category')).toHaveLength(3);
      expect(wrapper.find('.guide-category__title')).toHaveLength(2);
    });

    it('shows the correct icons', () => {
      expect(wrapper.find('.guide-category__title--getting-started')).toHaveLength(1);
      expect(wrapper.find('.guide-category__title--use-case')).toHaveLength(1);
      expect(wrapper.find('.guide-category__title--deep-dive')).toHaveLength(0);
    });

    it('shows seven cards', () => {
      expect(wrapper.find('Card')).toHaveLength(7);
    });
  });
});
