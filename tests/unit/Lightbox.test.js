import React from 'react';
import { mount, shallow } from 'enzyme';
import Lightbox from '../../src/components/Lightbox';
import Modal from '@leafygreen-ui/modal';
// data for this component
import mockData from './data/Figure.test.json';

const mountLightbox = (nodeData) => mount(<Lightbox nodeData={nodeData} />);
const shallowLightbox = (nodeData) => shallow(<Lightbox nodeData={nodeData} />);

describe('Lightbox', () => {
  let wrapper;
  let shallowWrapper;

  beforeAll(() => {
    wrapper = mountLightbox(mockData);
    shallowWrapper = shallowLightbox(mockData);
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('displays lightbox classes', () => {
    expect(wrapper.find('.lightbox')).toHaveLength(1);
    expect(wrapper.find('.lightbox__imageWrapper')).toHaveLength(1);
  });

  it('does not display the modal', () => {
    expect(wrapper.find('Modal')).toHaveLength(0);
  });

  it('shows a caption', () => {
    expect(wrapper.find('.lightbox__caption')).toHaveLength(1);
    expect(wrapper.find('.lightbox__caption').text()).toEqual('click to enlarge');
  });

  it('clicking the photo', () => {
    const modalOpener = wrapper.find('.lightbox__imageWrapper');
    modalOpener.simulate('click');
  });

  it('displays the modal', () => {
    expect(wrapper.find('Modal')).toHaveLength(1);
  });

  it('clicking anywhere on the modal', () => {
    const modalOpener = wrapper.find('.leafygreen-ui-xhlipt');
    modalOpener.simulate('click');
  });

  it('closes the modal', () => {
    expect(wrapper.find('Modal')).toHaveLength(0);
  });
});
