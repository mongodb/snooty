import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeprecatedVersionSelector from '../../src/components/DeprecatedVersionSelector';
import * as realm from '../../src/utils/realm';

const deprecatedVersions = {
  docs: ['v2.2', 'v2.4', 'v2.6', 'v3.0', 'v3.2', 'v3.4'],
  mms: ['v1.1', 'v1.2', 'v1.3'],
  mongocli: ['v0.5.0'],
  'atlas-open-service-broker': ['master'],
};

const metadata = {
  deprecated_versions: deprecatedVersions,
};

const mockedReposBranches = [
  {
    project: 'docs',
    displayName: 'MongoDB Manual',
    url: {
      dotcomprd: 'https://mongodb.com/',
    },
    prefix: {
      dotcomprd: 'docs',
    },
  },
  {
    project: 'mongocli',
    displayName: 'MongoDB Command Line Interface',
    url: {
      dotcomprd: 'https://mongodb.com/',
    },
    prefix: {
      dotcomprd: 'docs/mongocli',
    },
  },
  {
    project: 'atlas-open-service-broker',
    displayName: 'MongoDB Atlas Open Service Broker on Kubernetes',
    url: {
      dotcomprd: 'https://mongodb.com/',
    },
    prefix: {
      dotcomprd: 'docs/atlas-open-service-broker',
    },
  },
];

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));

describe('DeprecatedVersionSelector when rendered', () => {
  let wrapper, mockFetchDocuments;

  beforeEach(() => {
    mockFetchDocuments = jest.spyOn(realm, 'fetchDocuments').mockImplementation(async (dbName, collectionName) => {
      return mockedReposBranches;
    });
  });

  afterAll(() => {
    mockFetchDocuments.mockClear();
  });

  it('shows two dropdowns', async () => {
    wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

    const productDropdown = await wrapper.findAllByText('Select a Product');
    const versionDropdown = await wrapper.findAllByText('Select a Version');

    expect(productDropdown).toBeTruthy();
    expect(versionDropdown).toBeTruthy();
  });

  it('shows a disabled submit button', async () => {
    wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

    const button = await wrapper.findByTitle('View Documentation');
    expect(button).toBeTruthy();
    expect(button).toBeDisabled();
  });

  it('shows a disabled version selector', async () => {
    wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

    await wrapper.findAllByRole('button');
    expect(wrapper.container.querySelectorAll('button')[1]).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not show either dropdown menu', async () => {
    await waitFor(() => {
      wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);
    });

    expect(wrapper.queryAllByText('mms')).toHaveLength(0);
    expect(wrapper.queryAllByText(deprecatedVersions.mms[0])).toHaveLength(0);
  });

  // Test product dropdown
  describe('when the product button is clicked', () => {
    it('shows the dropdown menu with elements per metadata node', () => {
      wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);

      expect(wrapper.findByText('MongoDB Manual')).toBeTruthy();
      expect(wrapper.findByText('MongoDB Ops Manager')).toBeTruthy();
      expect(wrapper.findByText('MongoDB Atlas Open Service Broker on Kubernetes')).toBeTruthy();
    });

    it('version dropdown text is correct', () => {
      wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);
      expect(wrapper.getByText('Version')).toBeTruthy();
    });
  });

  describe('when the product button is clicked again', () => {
    it('hides the dropdown menu', () => {
      wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);

      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);
      userEvent.click(productDropdown);

      expect(wrapper.container.querySelectorAll('button')[0]).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('when the selected product has a single deprecated version', () => {
    test.each([
      ['MongoDB Command Line Interface', 'Version 0.5.0', 'https://mongodb.com/docs/mongocli/v0.5.0'],
      [
        'MongoDB Atlas Open Service Broker on Kubernetes',
        'latest',
        'https://mongodb.com/docs/atlas-open-service-broker/',
      ],
    ])('generates the correct docs URL', async (product, versionSelection, expectedUrl) => {
      const wrapper = render(<DeprecatedVersionSelector metadata={metadata} />);
      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);
      const productOption = await wrapper.findByText(product);
      userEvent.click(productOption);

      const versionDropdown = wrapper.container.querySelectorAll('button')[1];
      userEvent.click(versionDropdown);
      const versionOption = await wrapper.findByText(versionSelection);
      userEvent.click(versionOption);

      const button = await wrapper.findByTitle('View Documentation');
      expect(button).toHaveAttribute('aria-disabled', 'false');
      expect(button.href).toEqual(expectedUrl);
    });
  });
});
