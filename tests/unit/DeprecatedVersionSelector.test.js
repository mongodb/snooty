import React from 'react';
import { mount } from 'enzyme';
import DeprecatedVersionSelector from '../../src/components/landing/DeprecatedVersionSelector';

const deprecatedVersions = {
  manual: ['v2.2', 'v2.4', 'v2.6', 'v3.0', 'v3.2', 'v3.4'],
  mms: ['v1.1', 'v1.2', 'v1.3'],
};

// Case 1: no product selected
describe('when rendered', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<DeprecatedVersionSelector deprecatedVersions={deprecatedVersions} />);
  });

  it('shows three button group', () => {
    expect(wrapper.find('.btn-group')).toHaveLength(3);
  });

  it('does not show the dropdown menu', () => {
    expect(wrapper.find('ul')).toHaveLength(0);
  });

  // Test product dropdown
  describe('when the product button is clicked', () => {
    beforeAll(() => {
      wrapper.find('.product-button').simulate('click');
    });

    it('shows the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(1);
    });

    it('dropdown button text shows "Any Product"', () => {
      expect(wrapper.find('.product-button').text()).toBe('Any Product');
    });

    it('has 2 list elements', () => {
      expect(wrapper.find('ul').children()).toHaveLength(2);
    });

    it('shows the proper name for product', () => {
      expect(
        wrapper
          .find('li')
          .first()
          .text()
      ).toBe('MongoDB Server');
    });
  });

  describe('when the button is clicked again', () => {
    beforeAll(() => {
      wrapper.find('Button').simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });
  });

  // Test version dropdown
  describe('when the version button is clicked', () => {
    beforeAll(() => {
      wrapper.find('.version-button').simulate('click');
    });

    // Version dropdown is disabled until a product is selected
    it('does not show the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });

    it('dropdown button text shows "Any Version"', () => {
      expect(wrapper.find('.version-button').text()).toBe('Any Version');
    });
  });
});

// Case 2: Server is selected from thr product dropdown
describe('when rendered', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<DeprecatedVersionSelector deprecatedVersions={deprecatedVersions} />);
  });

  describe('when "MongoDB Server" is selected', () => {
    beforeAll(() => {
      wrapper.find('.manual').simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });

    it('shows "MongoDB Server" on the top button', () => {
      expect(wrapper.find('.product-button').text()).toBe('MongoDB Server');
    });
  });

  // Test version dropdown
  describe('when the version button is clicked', () => {
    beforeAll(() => {
      wrapper.find('.version-button').simulate('click');
    });

    it('shows the version dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(1);
    });

    it('has 6 list elements', () => {
      expect(wrapper.find('ul').children()).toHaveLength(6);
    });
  });

  describe('when the version button is clicked again', () => {
    beforeAll(() => {
      wrapper.find('.version-button').simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });
  });
});
