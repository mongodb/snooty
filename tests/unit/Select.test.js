import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import Select from '../../src/components/Select';

const DEFAULT_ATLAS_CHOICE = { text: 'MongoDB Atlas', value: 'atlas' };
const DEFAULT_SERVER_CHOICE = { text: 'MongoDB Server', value: 'server' };
const DEFAULT_CHOICES = [DEFAULT_SERVER_CHOICE, DEFAULT_ATLAS_CHOICE];

// Simple wrapper to add state control around the Pagination component
const SelectController = ({
  choices,
  customOnChange = null,
  defaultText = '',
  disabled = false,
  label = null,
  value = null,
}) => {
  const [selectValue, setSelectValue] = useState(value);
  const onChange = choice => {
    if (customOnChange) customOnChange(choice);
    setSelectValue(choice.value);
  };
  return (
    <Select
      choices={choices}
      onChange={onChange}
      defaultText={defaultText}
      disabled={disabled}
      label={label}
      value={selectValue}
    />
  );
};

describe('Select', () => {
  // Helper to open the dropdown passed a series of simulate args (click, keypress)
  const dropdownOpen = (args = ['click'], props = {}) => {
    const wrapper = mount(<SelectController choices={DEFAULT_CHOICES} {...props} />);
    // Dropdown should be closed by default
    expect(!wrapper.find('Options').exists());
    const selectParent = wrapper.find('StyledCustomSelect');
    selectParent.simulate(...args);
    // Now it should be open
    expect(wrapper.find('Options').exists());
    return wrapper;
  };

  it('renders select correctly', () => {
    const wrapper = shallow(<SelectController choices={DEFAULT_CHOICES} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('displays default text', () => {
    const defaultText = 'Some default text';
    const wrapper = mount(<SelectController choices={DEFAULT_CHOICES} defaultText={defaultText} />);
    const renderedText = wrapper.find('SelectedText').text();
    expect(renderedText).toBe(defaultText);
  });

  it('opens a dropdown with options when clicked', () => {
    dropdownOpen();
  });

  it('opens a dropdown with options with the enter key for accessibility', () => {
    dropdownOpen(['keypress', { key: 'Enter' }]);
  });

  it('prevents interaction when disabled', () => {
    const wrapper = mount(<SelectController choices={DEFAULT_CHOICES} disabled />);
    // Dropdown should be closed by default
    expect(!wrapper.find('Options').exists());
    const selectParent = wrapper.find('StyledCustomSelect');
    selectParent.simulate('click');
    selectParent.simulate('keypress', { key: 'Enter' });
    // It should still be closed
    expect(!wrapper.find('Options').exists());
  });

  it('closes the dropdown by clicking again on the toggle parent', () => {
    const wrapper = dropdownOpen();
    const selectParent = wrapper.find('StyledCustomSelect');
    selectParent.simulate('click');
    // Dropdown was previously open, it should now be closed
    expect(!wrapper.find('Options').exists());
  });

  it('updates the selected text when an item is clicked', () => {
    const defaultText = 'Default Text';
    const wrapper = dropdownOpen(['click'], { defaultText });
    let renderedText = wrapper.find('SelectedText').text();
    expect(renderedText).toBe(defaultText);
    const firstOption = wrapper.find('Option').at(0);
    expect(firstOption.text()).toBe(DEFAULT_CHOICES[0].text);
    firstOption.simulate('click');
    renderedText = wrapper.find('SelectedText').text();
    expect(renderedText).toBe(DEFAULT_CHOICES[0].text);
  });

  it('passes the entire choice to the onChange callback', () => {
    const customOnChange = jest.fn();
    const wrapper = dropdownOpen(['click'], { customOnChange });
    const firstOption = wrapper.find('Option').at(0);
    expect(firstOption.text()).toBe(DEFAULT_CHOICES[0].text);
    firstOption.simulate('click');
    expect(customOnChange.mock.calls.length).toBe(1);
    expect(customOnChange.mock.calls[0][0]).toStrictEqual(DEFAULT_CHOICES[0]);
  });
});
