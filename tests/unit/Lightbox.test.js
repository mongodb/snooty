import React from 'react';
import { mount, shallow } from 'enzyme';
import Lightbox from '../../src/components/Lightbox';
// data for this component
import mockData from './data/Figure.test.json';

const mountLightbox = (nodeData) =>
  mount(
    <div className="lightbox_imagewrapper">
      <Lightbox nodeData={nodeData} />
    </div>
  );
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
    expect(wrapper).toMatchSnapshot();
  });

  it('displays lightbox', () => {
    expect(wrapper.find('Lightbox')).toHaveLength(1);
    expect(wrapper.find('Image')).toHaveLength(1);
  });

  it('does not display the modal', () => {
    expect(wrapper.exists('Modal')).toBe(true);
    expect(wrapper.find('Modal').prop('open')).toBe(false);
  });

  it('shows a caption', () => {
    expect(wrapper.find('LightboxCaption')).toHaveLength(1);
    expect(wrapper.find('LightboxCaption').text()).toEqual('click to enlarge');
  });

  it('clicking the photo', () => {
    const modalOpener = wrapper.find('Image');
    modalOpener.simulate('click');
    expect(wrapper.exists('Modal')).toBe(true);
    expect(wrapper.find('Modal').prop('open')).toBe(true);
  });

  it('clicking anywhere outside of the modal', () => {
    const lightboxWrapper = wrapper.find('LightboxCaption');
    lightboxWrapper.simulate('click');
    expect(wrapper.find('Modal').prop('open')).toBe(false);
  });
});
