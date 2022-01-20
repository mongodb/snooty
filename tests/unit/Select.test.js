import React, { useState } from 'react';
import { render } from '@testing-library/react';
import Select from '../../src/components/Select';
import userEvent from '@testing-library/user-event';

const DEFAULT_ATLAS_CHOICE = { text: 'MongoDB Atlas', value: 'atlas' };
const DEFAULT_SERVER_CHOICE = { text: 'MongoDB Server', value: 'server' };
const DEFAULT_CHOICES = [DEFAULT_SERVER_CHOICE, DEFAULT_ATLAS_CHOICE];

// Simple wrapper to add state control around the Pagination component
const SelectController = ({
  choices = DEFAULT_CHOICES,
  customOnChange = null,
  defaultText = '',
  disabled = false,
  label = null,
  value = null,
}) => {
  const [selectValue, setSelectValue] = useState(value);
  const onChange = (choice) => {
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
  const dropdownOpen = (props = {}, openWithKeyboard = false) => {
    const wrapper = render(<SelectController {...props} />);
    // Dropdown should be closed by default
    const dropdown = wrapper.getByRole('listbox');
    expect(dropdown).toHaveAttribute('aria-expanded', 'false');
    if (openWithKeyboard) {
      userEvent.tab();
      userEvent.keyboard('{Enter}');
    } else {
      userEvent.click(dropdown);
    }
    // Now it should be open
    expect(dropdown).toHaveAttribute('aria-expanded', 'true');
    return wrapper;
  };

  it('renders select correctly', () => {
    const wrapper = render(<SelectController />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('displays default text', () => {
    const defaultText = 'Some default text';
    const wrapper = render(<SelectController defaultText={defaultText} />);
    const renderedText = wrapper.getByText(defaultText);
    expect(renderedText).toBeTruthy();
  });

  it('conditionally should render a label', () => {
    const labelText = 'Select Label';
    const wrapperWithLabel = render(<SelectController label={labelText} />);
    expect(wrapperWithLabel.getByText(labelText)).toBeTruthy();
  });

  it('opens a dropdown with options when clicked', () => {
    dropdownOpen();
  });

  it('opens a dropdown with options with the enter key for accessibility', () => {
    dropdownOpen({ key: 'Enter' }, true);
  });

  it('passes disabled prop through to select implementation when given', () => {
    const wrapper = render(<SelectController disabled />);
    // Dropdown should be closed by default
    // parent element access is limitation of implementation
    // TODO: look at select implementation to see if disabled div and listbox role div can be coalesced
    expect(wrapper.getByRole('listbox').parentElement).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes the dropdown by clicking again on the toggle parent', () => {
    const wrapper = dropdownOpen();
    const dropdown = wrapper.getByRole('listbox');
    userEvent.click(dropdown);
    // Dropdown was previously open, it should now be closed
    expect(dropdown).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates the selected text when an item is clicked', () => {
    const defaultText = 'Default Text';
    const wrapper = dropdownOpen({ defaultText });
    let renderedText = wrapper.getByText(defaultText);
    expect(renderedText).toBeTruthy();
    //Implementation stores the 'select' in the first option field, as rendered html
    const firstOption = wrapper.queryAllByRole('option')[1];
    expect(firstOption.textContent).toBe(DEFAULT_CHOICES[0].text);
    userEvent.click(firstOption);
    //check the first option field to make sure it updated
    renderedText = wrapper.queryAllByRole('option')[0];
    expect(renderedText.textContent).toBe(DEFAULT_CHOICES[0].text);
  });

  it('passes the entire choice to the onChange callback', () => {
    const customOnChange = jest.fn();
    const wrapper = dropdownOpen({ customOnChange });
    const firstOption = wrapper.queryAllByRole('option')[1];
    expect(firstOption.textContent).toBe(DEFAULT_CHOICES[0].text);
    userEvent.click(firstOption);
    expect(customOnChange.mock.calls.length).toBe(1);
    expect(customOnChange.mock.calls[0][0]).toStrictEqual(DEFAULT_CHOICES[0]);
  });

  it('should update selected text given a value', () => {
    const wrapper = render(<SelectController value={DEFAULT_CHOICES[0].value} />);
    expect(wrapper.getByText(DEFAULT_CHOICES[0].text)).toBeTruthy();
  });

  it('should reset the form when null/empty string is passed as value', () => {
    const defaultText = 'Reset text';
    // Bypass SelectController so we can directly rerender with equivalent component + state
    const wrapper = render(
      <Select
        defaultText={defaultText}
        choices={DEFAULT_CHOICES}
        onChange={() => {}}
        value={DEFAULT_CHOICES[0].value}
      />
    );
    expect(wrapper.getByText(DEFAULT_CHOICES[0].text)).toBeTruthy();
    wrapper.rerender(<Select defaultText={defaultText} choices={DEFAULT_CHOICES} onChange={() => {}} value={''} />);
    expect(wrapper.getByText(defaultText)).toBeTruthy();
  });
});
