import React from 'react';
import { mount, shallow } from 'enzyme';
import Card from '../../src/components/Card';

import cardData from './data/Card.test.json';
import multiCardData from './data/MultiCard.test.json';
import refDocMappingData from './data/index.test.json';

const mountCard = ({ card, refDocMapping, time }) =>
  mount(<Card card={card} refDocMapping={refDocMapping} time={time} />);

const shallowCard = ({ card, refDocMapping, time }) =>
  shallow(<Card card={card} refDocMapping={refDocMapping} time={time} />);

describe('when a standard card is mounted', () => {
  let wrapper;
  let shallowWrapper;

  beforeAll(() => {
    wrapper = mountCard({ card: cardData, refDocMapping: refDocMappingData, time: '20' });
    shallowWrapper = shallowCard({ card: cardData, refDocMapping: refDocMappingData, time: '20' });
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
    wrapper = mountCard({ card: multiCardData, refDocMapping: refDocMappingData, time: '20' });
    shallowWrapper = shallowCard({ card: multiCardData, refDocMapping: refDocMappingData, time: '20' });
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('does not display a time estimate', () => {
    expect(wrapper.find('.guide__time')).toHaveLength(0);
  });
});
