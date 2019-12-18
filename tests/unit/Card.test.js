import React from 'react';
import { mount, shallow } from 'enzyme';
import Card from '../../src/components/LandingPage/Card';

import cardData from './data/Card.test.json';
import multiCardData from './data/MultiCard.test.json';
import mockGuidesMetadata from './data/guidesPageMetadata.json';

const mountCard = ({ card }) => mount(<Card card={card} guidesMetadata={mockGuidesMetadata} />);

const shallowCard = ({ card }) => shallow(<Card card={card} guidesMetadata={mockGuidesMetadata} />);

describe('Card component', () => {
  describe('when a standard card is mounted', () => {
    let wrapper;
    let shallowWrapper;

    beforeAll(() => {
      wrapper = mountCard({ card: cardData });
      shallowWrapper = shallowCard({ card: cardData });
    });

    it('renders correctly', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('displays a time estimate', () => {
      expect(wrapper.find('.guide__time')).toHaveLength(1);
    });
  });

  describe('when a multi card is mounted', () => {
    let wrapper;
    let shallowWrapper;

    beforeAll(() => {
      wrapper = mountCard({ card: multiCardData });
      shallowWrapper = shallowCard({ card: multiCardData });
    });

    it('renders correctly', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('does not display a time estimate', () => {
      expect(wrapper.find('.guide__time')).toHaveLength(0);
    });
  });
});
