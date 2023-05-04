import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OpenAPIChangelog from '../../src/components/OpenAPIChangelog';

describe('OpenAPIChangelog tests', () => {
  it('OpenAPIChangelog renders correctly', () => {
    const tree = render(<OpenAPIChangelog />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  describe('Select Resources combobox tests', () => {
    it('Has all of the options available when dropdown is opened', () => {
      const { getByLabelText, getAllByTestId } = render(<OpenAPIChangelog />);
      const selectResourceInputEl = getByLabelText('Select Resource');

      // open dropdown
      userEvent.click(selectResourceInputEl);

      // retrieve dropdown options

      const options = getAllByTestId('resource-select-option');

      // act
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

      // act
      expect(actualSelectedValue).toEqual(expectedSelectedValue);
    });
  });
});
