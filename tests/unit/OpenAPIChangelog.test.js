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
});
