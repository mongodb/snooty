import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MethodSelector } from '../../src/components/MethodSelector';
import { getTestId } from '../../src/components/MethodSelector/MethodOptionContent';
import mockData from './data/MethodSelector.test.json';

/**
 * @param {HTMLElement} el
 * @returns {string}
 */
const getOptionName = (el) => {
  return el.getAttribute('value').split('-')[0];
};

describe('MethodSelector component', () => {
  it('renders options with first method by default', () => {
    const res = render(<MethodSelector nodeData={mockData} />);
    const selected = res.getByRole('radio', { checked: true });
    const optionName = getOptionName(selected);
    const contentTestId = getTestId(optionName);
    expect(res.getByTestId(contentTestId)).toBeVisible();
  });

  it('handles switching between method options', async () => {
    const res = render(<MethodSelector nodeData={mockData} />);
    let selected = res.getByRole('radio', { checked: true });
    const options = await res.findAllByRole('radio');
    const originalOptionName = getOptionName(selected);
    const originalTestId = getTestId(originalOptionName);
    expect(options[0]).toBeChecked();
    expect(res.getByTestId(originalTestId)).toBeVisible();

    // Click new method option
    const targetIndex = 2;
    userEvent.click(options[targetIndex].closest('label'));
    expect(options[0]).not.toBeChecked();
    expect(options[targetIndex]).toBeChecked();

    // Ensure content is present
    selected = res.getByRole('radio', { checked: true });
    const optionName = getOptionName(selected);
    const contentEl = res.getByTestId(getTestId(optionName));
    expect(contentEl).toBeVisible();
    expect(res.getByTestId(originalTestId)).not.toBeVisible();
  });
});
