import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeprecatedVersionSelector from '../../src/components/DeprecatedVersionSelector';

const deprecatedVersions = {
  docs: ['v2.2', 'v2.4', 'v2.6', 'v3.0', 'v3.2', 'v3.4'],
  mms: ['v1.1', 'v1.2', 'v1.3'],
  mongocli: ['v0.5.0'],
  'atlas-open-service-broker': ['master'],
};

const metadata = {
  deprecated_versions: deprecatedVersions,
};

describe('when rendered', () => {
  jest.useFakeTimers();

  it('shows two dropdowns', () => {
    const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);
    const productDropdown = wrapper.queryAllByText('Select a Product');
    const versionDropdown = wrapper.queryAllByText('Select a Version');

    expect(productDropdown).toBeTruthy();
    expect(versionDropdown).toBeTruthy();
  });

  it('shows a disabled submit button', () => {
    const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

    const button = wrapper.getByTitle('View Documentation');
    expect(button).toBeTruthy();
    expect(button).toBeDisabled();
  });

  it('shows a disabled version selector', () => {
    const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);
    const versionDropdown = wrapper.getByText('Select a Version');

    // Limitation of implementation here - may be desirable to move text from the <p> tag
    // to the actual dropdown div
    expect(versionDropdown.parentElement).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not show either dropdown menu', () => {
    const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

    expect(wrapper.queryAllByText('mms')).toHaveLength(0);
    expect(wrapper.queryAllByText(deprecatedVersions.mms[0])).toHaveLength(0);
  });

  // Test product dropdown
  describe('when the product button is clicked', () => {
    it('shows the dropdown menu with elements per metadata node', () => {
      const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

      //see TODO above re: limitation of having text in a <p> tag
      const productDropdown = wrapper.queryAllByRole('listbox')[0];
      userEvent.click(productDropdown);

      expect(wrapper.getByText('MongoDB Server')).toBeTruthy();
      expect(wrapper.getByText('MongoDB Ops Manager')).toBeTruthy();
      expect(wrapper.getByText('MongoDB Atlas Open Service Broker on Kubernetes')).toBeTruthy();
    });

    it('version dropdown text is correct', () => {
      const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

      //see TODO above re: limitation of having text in a <p> tag
      const productDropdown = wrapper.queryAllByRole('listbox')[0];
      userEvent.click(productDropdown);
      expect(wrapper.getByText('Version')).toBeTruthy();
    });
  });

  describe('when the product button is clicked again', () => {
    it('hides the dropdown menu', () => {
      const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

      //see TODO above re: limitation of having text in a <p> tag
      const productDropdown = wrapper.queryAllByRole('listbox')[0];
      userEvent.click(productDropdown);
      userEvent.click(productDropdown);

      expect(wrapper.queryAllByText('MongoDB Server')).toHaveLength(0);
    });
  });

  describe('when the selected product has a single deprecated version', () => {
    test.each([
      ['MongoDB CLI', 'Version 0.5.0', 'https://www.mongodb.com/docs/mongocli/v0.5.0'],
      [
        'MongoDB Atlas Open Service Broker on Kubernetes',
        'latest',
        'https://www.mongodb.com/docs/atlas-open-service-broker/',
      ],
    ])('generates the correct docs URL', (product, versionSelection, expectedUrl) => {
      const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);
      const productDropdown = wrapper.queryAllByRole('listbox')[0];
      userEvent.click(productDropdown);
      userEvent.click(wrapper.getByText(product));

      const versionDropdown = wrapper.queryAllByRole('listbox')[1];
      userEvent.click(versionDropdown);
      userEvent.click(wrapper.getByText(versionSelection));

      const button = wrapper.getByTitle('View Documentation');
      expect(button).toHaveAttribute('aria-disabled', 'false');
      expect(button.href).toEqual(expectedUrl);
    });
  });
});
