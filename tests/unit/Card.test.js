import React from 'react';
import { mount, render } from 'enzyme';
import Card from '../../src/components/LandingPage/Card';

import cardData from './data/Card.test.json';
import multiCardData from './data/MultiCard.test.json';
import mockGuidesMetadata from './data/guidesPageMetadata.json';

const mountCard = ({ card }) => mount(<Card card={card} guidesMetadata={mockGuidesMetadata} />);

const renderCard = ({ card }) => render(<Card card={card} guidesMetadata={mockGuidesMetadata} />);

describe('Card component', () => {
  let wrapper;
  let render;
  describe('when a standard card is mounted', () => {
    beforeAll(() => {
      wrapper = mountCard({ card: cardData });
      render = renderCard({ card: cardData });
    });

    it('renders correctly', () => {
      expect(render).toMatchSnapshot();
    });

    it('displays a time estimate', () => {
      expect(wrapper.find('.guide__time')).toHaveLength(1);
    });
  });

  describe('when a multi card is mounted', () => {
    beforeAll(() => {
      wrapper = mountCard({ card: multiCardData });
      render = renderCard({ card: multiCardData });
    });

    it('renders correctly', () => {
      expect(render).toMatchSnapshot();
    });

    it('does not display a time estimate', () => {
      expect(wrapper.find('.guide__time')).toHaveLength(0);
    });
  });
});
