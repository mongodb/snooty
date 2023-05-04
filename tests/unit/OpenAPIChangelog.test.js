import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OpenAPIChangelog from '../../src/components/OpenAPIChangelog';

describe('OpenAPIChangelog tests', () => {
  it('OpenAPIChangelog renders correctly', () => {
    const tree = render(<OpenAPIChangelog />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  describe('Version Mode segmented control tests', () => {
    it('Does not display diff options when the all versions option is selected', () => {
      const { getByTestId, getByLabelText } = render(<OpenAPIChangelog />);

      const allVersionsOption = getByTestId('all-versions-option');

      const isAllVersionsSelected = allVersionsOption.firstElementChild.getAttribute('aria-selected');

      expect(isAllVersionsSelected).toBe('true');

      expect(() => getByLabelText('Resource Version 1')).toThrowError();
      expect(() => getByLabelText('Resource Version 2')).toThrowError();
    });

    it('Does display diff options when compares versions option is selected', () => {
      const { getByTestId, getByLabelText } = render(<OpenAPIChangelog />);

      const compareVersionsOption = getByTestId('version-control-option');
      const compareVersionsOptionButton = compareVersionsOption.firstElementChild;

      userEvent.click(compareVersionsOptionButton);

      const isCompareVersionsSelected = compareVersionsOptionButton.getAttribute('aria-selected');

      expect(isCompareVersionsSelected).toBe('true');

      expect(() => getByLabelText('Resource Version 1')).toBeTruthy();
      expect(() => getByLabelText('Resource Version 2')).toBeTruthy();
    });
  });

  describe('Select Resources combobox tests', () => {
    it('Has all of the options available when dropdown is opened', () => {
      const { getByLabelText, getAllByTestId } = render(<OpenAPIChangelog />);
      const selectResourceInputEl = getByLabelText('Select Resource');

      // open dropdown
      userEvent.click(selectResourceInputEl);

      // retrieve dropdown options
      const options = getAllByTestId('resource-select-option');

      // assert
      expect(options.length).toEqual(3);
    });

    it('Updates the Select Resources combobox when option is selected from dropdown', () => {
      const expectedSelectedValue = 'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/restore';
      const tree = render(<OpenAPIChangelog />);
      const selectResourceInputEl = tree.getByLabelText('Select Resource');

      // open dropdown
      userEvent.click(selectResourceInputEl);

      // get options
      const options = tree.getAllByTestId('resource-select-option');

      // click second option
      userEvent.click(options[1]);

      const actualSelectedValue = selectResourceInputEl.getAttribute('value');

      // assert
      expect(actualSelectedValue).toEqual(expectedSelectedValue);
    });
  });

  describe('version compare comboboxes tests', () => {
    it('has different options from each other', () => {
      const { getByTestId, getByLabelText, getAllByTestId } = render(<OpenAPIChangelog />);

      // switch to compare versions on segment control
      const compareVersionsOption = getByTestId('version-control-option');
      const compareVersionsOptionButton = compareVersionsOption.firstElementChild;

      userEvent.click(compareVersionsOptionButton);

      // get diff comboboxes and open each to reveal the resource version options of each
      const resourceVersionOneCombobox = getByLabelText('Resource Version 1');
      const resourceVersionTwoCombobox = getByLabelText('Resource Version 2');

      userEvent.click(resourceVersionOneCombobox);
      const resourceVersionOneOptions = getAllByTestId('version-one-option');

      const getOptionStrings = (o) => {
        /**
         * The selected option has a <strong> tag that surronds the value.
         * For example, if '2023-01-01' is selected, calling o.getElementsByTagName('span')[0].innerHTML
         * will get us '<strong>2023-01-01</strong>'. We can strip it by getting the firstElementChild,
         * and returning the innerHTML of that. The firstElementChild will be the <strong> element.
         * If there is no firstElementChild, the value will be null and we just return the string like normal
         */
        if (o.getElementsByTagName('span')[0].firstElementChild) {
          return o.getElementsByTagName('span')[0].firstElementChild.innerHTML;
        }

        return o.getElementsByTagName('span')[0].innerHTML;
      };

      const resourceVersionOneOptionValues = resourceVersionOneOptions.map(getOptionStrings);
      const selectedResourceVersionOneOption = resourceVersionOneOptionValues[0];

      // select first option again to close combobox
      userEvent.click(resourceVersionOneOptions[0]);

      userEvent.click(resourceVersionTwoCombobox);
      const resourceVersionTwoOptions = getAllByTestId('version-two-option');

      const resourceVersionTwoOptionValues = resourceVersionTwoOptions.map(getOptionStrings);

      const selectedResourceVersionTwoOption = resourceVersionTwoOptionValues[0];

      expect(resourceVersionOneOptionValues).not.toContain(selectedResourceVersionTwoOption);
      expect(resourceVersionTwoOptionValues).not.toContain(selectedResourceVersionOneOption);
    });
  });
});
