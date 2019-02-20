import React from 'react';
import { mount, shallow } from 'enzyme';
import LandingPageCards, { Category } from '../src/components/LandingPageCards';
import Card from '../src/components/Card';

const mountLandingPageCards = ({ guides, refDocMapping }) => 
  mount(<LandingPageCards guides={guides} refDocMapping={refDocMapping} />);

const shallowLandingPageCards = ({ guides, refDocMapping }) => 
  shallow(<LandingPageCards guides={guides} refDocMapping={refDocMapping} />);

const getOneCategoryDefaultProps = () => ({
  guides: [
    {
      argument: [{
        value: 'server/install'
      }],
      name: 'card'
    }
  ],
  refDocMapping: {
    'server/install': {
      ast: {
        children: [{
          children: [
            {
              children: [{
                type: 'text',
                value: 'Install MongoDB'
              }],
              type: 'heading'
            },
            {
              argument: [{
                type: 'text',
                value: 'Getting Started'
              }],
              children: [],
              name: 'type',
              type: 'directive'
            }
          ]
        }]
      }
    }
  }
});

describe('when mounted with one type of guide', () => {
  let wrapper;
  let shallowWrapper;

  beforeAll(() => {
    wrapper = mountLandingPageCards(getOneCategoryDefaultProps());
    shallowWrapper = shallowLandingPageCards(getOneCategoryDefaultProps());
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('only shows one heading', () => {
    expect(wrapper.find('Category')).toHaveLength(3);
    expect(wrapper.find('.guide-category__title')).toHaveLength(1);
  });

  it('shows one card', () => {
    expect(wrapper.find('Card')).toHaveLength(1);
  });
});

describe('when mounted with two types of guide', () => {
  let wrapper;
  let shallowWrapper;

  beforeAll(() => {
    wrapper = mountLandingPageCards(getTwoCategoryDefaultProps());
    shallowWrapper = shallowLandingPageCards(getTwoCategoryDefaultProps());
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('only shows one heading', () => {
    expect(wrapper.find('Category')).toHaveLength(3);
    expect(wrapper.find('.guide-category__title')).toHaveLength(2);
  });

  it('shows x cards', () => {
  });
});

