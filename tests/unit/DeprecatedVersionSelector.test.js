import React from 'react';
import { mount } from 'enzyme';
import DeprecatedVersionSelector from '../../src/components/landing/DeprecatedVersionSelector';

const deprecatedVersions = {
  docs: ['v2.2', 'v2.4', 'v2.6', 'v3.0', 'v3.2', 'v3.4'],
  mms: ['v1.1', 'v1.2', 'v1.3'],
};

const metadata = {
  deprecated_versions: deprecatedVersions,
};

describe('when rendered', () => {
  let wrapper;
  let productDropdown;
  let versionDropdown;

  beforeAll(() => {
    wrapper = mount(<DeprecatedVersionSelector metadata={metadata} />);
    productDropdown = wrapper.find('StyledCustomSelect').at(0);
    versionDropdown = wrapper.find('StyledCustomSelect').at(1);
  });

  it('shows two dropdowns', () => {
    expect(wrapper.find('Select')).toHaveLength(2);
  });

  it('shows a disabled submit button', () => {
    const button = wrapper.find('Button');
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBe(true);
  });

  it('shows a disabled version selector', () => {
    expect(
      wrapper
        .find('Select')
        .at(1)
        .prop('disabled')
    ).toBe(true);
  });

  it('does not show either dropdown menu', () => {
    expect(wrapper.find('ul')).toHaveLength(0);
  });

  // Test product dropdown
  describe('when the product button is clicked', () => {
    beforeAll(() => {
      productDropdown.simulate('click');
    });

    it('shows the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(1);
    });

    it('product dropdown text is correct', () => {
      expect(
        wrapper
          .find('SelectedText')
          .at(0)
          .text()
      ).toBe('Product');
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
      productDropdown.simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });
  });

  // Test version dropdown
  describe('when the version button is clicked', () => {
    beforeAll(() => {
      versionDropdown.simulate('click');
    });

    // Version dropdown is disabled until a product is selected
    it('does not show the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });

    it('version dropdown text is correct', () => {
      expect(
        wrapper
          .find('SelectedText')
          .at(1)
          .text()
      ).toBe('Version');
    });
  });

  describe('when the first option is selected', () => {
    beforeAll(() => {
      productDropdown.simulate('click');
      wrapper
        .find('ul')
        .childAt(0)
        .simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });

    it('shows the correct text', () => {
      expect(
        wrapper
          .find('SelectedText')
          .at(0)
          .text()
      ).toBe('MongoDB Server');
    });
  });

  // Test version dropdown
  describe('when the version button is clicked', () => {
    beforeAll(() => {
      versionDropdown.simulate('click');
    });

    it('shows the version dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(1);
    });

    it('has 6 list elements', () => {
      expect(wrapper.find('ul').children()).toHaveLength(6);
    });
  });

  describe('when a version is selected', () => {
    beforeAll(() => {
      wrapper
        .find('ul')
        .childAt(2)
        .simulate('click');
    });

    it('hides the dropdown menu', () => {
      expect(wrapper.find('ul')).toHaveLength(0);
    });

    it('enables the link button', () => {
      const button = wrapper.find('Button').first();
      expect(button.prop('disabled')).toBe(false);
    });
  });

  describe('when the product is changed', () => {
    beforeAll(() => {
      productDropdown.simulate('click');
      wrapper
        .find('ul')
        .childAt(1)
        .simulate('click');
    });

    it('version dropdown text is reset', () => {
      expect(
        wrapper
          .find('SelectedText')
          .at(1)
          .text()
      ).toBe('Version');
    });
  });
});
