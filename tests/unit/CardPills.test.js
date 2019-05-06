import React from 'react';
import { mount, shallow } from 'enzyme';
import CardPills from '../../src/components/LandingPage/CardPills';

import pillsNode from './data/pillsNode.test.json';

const mountCardPills = () => mount(<CardPills pillsNode={pillsNode} pillsetName="drivers" />);
const shallowCardPills = () => shallow(<CardPills pillsNode={pillsNode} pillsetName="drivers" />);

describe('CardPills component', () => {
  let wrapper;
  let shallowWrapper;

  beforeAll(() => {
    wrapper = mountCardPills();
    shallowWrapper = shallowCardPills();
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('clicks a pill', () => {
    wrapper.first('.guide__pill').simulate('click');
  });
});
