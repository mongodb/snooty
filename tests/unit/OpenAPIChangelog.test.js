import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OpenAPIChangelog from '../../src/components/OpenAPIChangelog';
import { mockChangelog, mockDiff } from './data/OpenAPIChangelog';

/**
 * Helper function to strip HTML from combobox list options
 * @param {*} o  the option element that is returned from the combobox
 * @returns an object containing the stripped down text for the option, and a boolean
 * stating whether or not the option is selected. This is helpful for testing to make sure
 * we get the option that is selected from the dropdown.
 */
const getComboboxOptionStrings = (o) => {
  /**
   * The selected option has a <strong> tag that surronds the value.
   * For example, if '2023-01-01' is selected, calling o.getElementsByTagName('span')[0].innerHTML
   * will get us '<strong>2023-01-01</strong>'. We can strip it by getting the firstElementChild,
   * and returning the innerHTML of that. The firstElementChild will be the <strong> element.
   * If there is no firstElementChild, the value will be null and we just return the string like normal
   */
  if (o.getElementsByTagName('span')[0].firstElementChild) {
    return { optionValue: o.getElementsByTagName('span')[0].firstElementChild.innerHTML, isSelected: true };
  }
  return { optionValue: o.getElementsByTagName('span')[0].innerHTML, isSelected: false };
};

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({
    commitHash: '',
    parserBranch: '',
    patchId: '',
    pathPrefix: '',
    project: '',
    snootyBranch: '',
    user: '',
  }),
}));

jest.mock('../../src/utils/use-snooty-metadata', () => () => ({
  openapi_pages: ['reference/api-resources-spec/v2'],
}));

describe('OpenAPIChangelog tests', () => {
  it('OpenAPIChangelog renders correctly', () => {
    const tree = render(<OpenAPIChangelog changelog={mockChangelog} diff={mockDiff} />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  describe('Version Mode segmented control tests', () => {
    it('Does not display diff options when the all versions option is selected', () => {
      const { getByTestId, queryByLabelText } = render(<OpenAPIChangelog changelog={mockChangelog} diff={mockDiff} />);

      const allVersionsOption = getByTestId('all-versions-option');

      const isAllVersionsSelected = allVersionsOption.firstElementChild.getAttribute('aria-selected');

      expect(isAllVersionsSelected).toBe('true');

      expect(queryByLabelText('Resource Version 1')).not.toBeInTheDocument();
      expect(queryByLabelText('Resource Version 2')).not.toBeInTheDocument();
    });

    it('Does display diff options when compares versions option is selected', () => {
      const { getByTestId, queryByLabelText } = render(<OpenAPIChangelog changelog={mockChangelog} diff={mockDiff} />);

      const compareVersionsOption = getByTestId('version-control-option');
      const compareVersionsOptionButton = compareVersionsOption.firstElementChild;

      userEvent.click(compareVersionsOptionButton);

      const isCompareVersionsSelected = compareVersionsOptionButton.getAttribute('aria-selected');

      expect(isCompareVersionsSelected).toBe('true');

      expect(queryByLabelText('Resource Version 1')).toBeInTheDocument();
      expect(queryByLabelText('Resource Version 2')).toBeInTheDocument();
    });
  });

  describe('version compare comboboxes tests', () => {
    it('has different options from each other', () => {
      const { getByTestId, getByLabelText, getAllByTestId } = render(
        <OpenAPIChangelog changelog={mockChangelog} diff={mockDiff} />
      );

      // switch to compare versions on segment control
      const compareVersionsOption = getByTestId('version-control-option');
      const compareVersionsOptionButton = compareVersionsOption.firstElementChild;

      userEvent.click(compareVersionsOptionButton);

      // get diff comboboxes and open each to reveal the resource version options of each
      const resourceVersionOneCombobox = getByLabelText('Resource Version 1');
      const resourceVersionTwoCombobox = getByLabelText('Resource Version 2');

      // open resource version 1 combobox
      userEvent.click(resourceVersionOneCombobox);

      const resourceVersionOneOptions = getAllByTestId('version-one-option');

      // get the options for the Resource Version 1 combobox as strings
      const resourceVersionOneOptionValues = resourceVersionOneOptions.map(getComboboxOptionStrings);
      const selectedResourceVersionOneOption = resourceVersionOneOptionValues.find((o) => o.isSelected).optionValue;

      // select first option again to close combobox
      userEvent.click(resourceVersionOneOptions[0]);

      // open the Resource Version 2 combobox
      userEvent.click(resourceVersionTwoCombobox);

      // get the dropdown items
      const resourceVersionTwoOptions = getAllByTestId('version-two-option');

      // get the options for the Resource Version 2 combobox as strings
      const resourceVersionTwoOptionValues = resourceVersionTwoOptions.map(getComboboxOptionStrings);

      const selectedResourceVersionTwoOption = resourceVersionTwoOptionValues.find((o) => o.isSelected).optionValue;

      // expect that the selected option for each version does not exist as an option for the other combobox
      expect(resourceVersionOneOptionValues).not.toContain(selectedResourceVersionTwoOption);
      expect(resourceVersionTwoOptionValues).not.toContain(selectedResourceVersionOneOption);
    });
  });
});
