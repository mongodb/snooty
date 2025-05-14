import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeprecatedVersionSelector from '../../src/components/DeprecatedVersionSelector';
import * as realm from '../../src/utils/realm';
import { useAllDocsets } from '../../src/hooks/useAllDocsets';

const mockedReposBranches = [
  {
    project: 'docs',
    displayName: 'MongoDB Manual',
    hasEolVersions: true,
    url: {
      dotcomprd: 'https://mongodb.com/',
    },
    prefix: {
      dotcomprd: 'docs',
    },
    branches: [
      { eol_type: 'link', versionSelectorLabel: 'v1.1', urlSlug: 'v1.1' },
      { eol_type: 'link', versionSelectorLabel: 'v1.11', urlSlug: 'v1.11' },
      { eol_type: 'link', versionSelectorLabel: 'v1.10', urlSlug: 'v1.10' },
      { eol_type: 'link', versionSelectorLabel: 'v1.2', urlSlug: 'v1.2' },
      { eol_type: 'link', versionSelectorLabel: 'v2.2', urlSlug: 'v2.2' },
      { eol_type: 'download', versionSelectorLabel: 'v2.4', urlSlug: 'v2.4' },
      { eol_type: 'link', versionSelectorLabel: 'v2.6', urlSlug: 'v2.6' },
      { eol_type: 'link', versionSelectorLabel: 'v3.0', urlSlug: 'v3.0' },
      { eol_type: 'download', versionSelectorLabel: 'v3.2', urlSlug: 'v3.2' },
      { eol_type: 'download', versionSelectorLabel: 'v3.4', urlSlug: 'v3.4' },
    ],
  },

  {
    project: 'mongocli',
    displayName: 'MongoDB Command Line Interface',
    hasEolVersions: true,
    url: {
      dotcomprd: 'https://mongodb.com/',
    },
    prefix: {
      dotcomprd: 'docs/mongocli',
    },
    branches: [{ eol_type: 'download', versionSelectorLabel: 'v0.5.0', urlSlug: 'v0.5.0' }],
  },
  {
    project: 'atlas-open-service-broker',
    displayName: 'MongoDB Atlas Open Service Broker on Kubernetes',
    hasEolVersions: true,
    url: {
      dotcomprd: 'https://mongodb.com/',
    },
    prefix: {
      dotcomprd: 'docs/atlas-open-service-broker',
    },
    branches: [{ eol_type: 'link', versionSelectorLabel: 'master', urlSlug: '' }],
  },
];

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));

jest.mock('../../src/hooks/useAllDocsets', () => ({
  useAllDocsets: jest.fn(),
}));

describe('DeprecatedVersionSelector when rendered', () => {
  let wrapper, mockFetchDocuments;

  beforeEach(() => {
    mockFetchDocuments = jest.spyOn(realm, 'fetchDocsets').mockImplementation(async (dbName) => {
      return mockedReposBranches;
    });
    useAllDocsets.mockImplementation(() => mockedReposBranches);
  });

  afterAll(() => {
    mockFetchDocuments.mockClear();
    useAllDocsets.mockClear();
  });

  it('shows two dropdowns', async () => {
    wrapper = render(<DeprecatedVersionSelector />);

    const productDropdown = await wrapper.findAllByText('Select a Product');
    const versionDropdown = await wrapper.findAllByText('Select a Version');

    expect(productDropdown).toBeTruthy();
    expect(versionDropdown).toBeTruthy();
  });

  it('shows a disabled submit button', async () => {
    wrapper = render(<DeprecatedVersionSelector />);

    const button = await wrapper.findByTitle('View or Download Documentation');
    expect(button).toBeTruthy();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows a disabled version selector', async () => {
    wrapper = render(<DeprecatedVersionSelector />);

    await wrapper.findAllByRole('button');
    expect(wrapper.container.querySelectorAll('button')[1]).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not show either dropdown menu', async () => {
    await waitFor(() => {
      wrapper = render(<DeprecatedVersionSelector />);
    });

    expect(wrapper.queryAllByText('MongoDB Connector for BI')).toHaveLength(0);
    expect(wrapper.queryAllByText(mockedReposBranches[0].branches[0].versionSelectorLabel)).toHaveLength(0);
  });

  // Test product dropdown
  describe('when the product button is clicked', () => {
    it('shows the dropdown menu with elements per metadata node', () => {
      wrapper = render(<DeprecatedVersionSelector />);

      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);

      expect(wrapper.getByText('MongoDB Manual')).toBeTruthy();
      expect(wrapper.getByText('MongoDB Atlas Open Service Broker on Kubernetes')).toBeTruthy();
    });

    it('version dropdown text is correct', () => {
      wrapper = render(<DeprecatedVersionSelector />);

      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);
      expect(wrapper.getByText('Version')).toBeTruthy();
    });
  });

  describe('when the product button is clicked again', () => {
    it('hides the dropdown menu', () => {
      wrapper = render(<DeprecatedVersionSelector />);

      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);
      userEvent.click(productDropdown);

      expect(wrapper.container.querySelectorAll('button')[0]).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('when the selected product has a single deprecated version', () => {
    test.each([
      [
        'MongoDB Command Line Interface',
        'Version 0.5.0',
        'https://www.mongodb.com/docs/offline/mongocli-v0.5.0.tar.gz',
      ],
      [
        'MongoDB Atlas Open Service Broker on Kubernetes',
        'Latest',
        'https://mongodb.com/docs/atlas-open-service-broker/',
      ],
    ])('generates the correct docs URL or download link', async (product, versionSelection, expectedUrl) => {
      const wrapper = render(<DeprecatedVersionSelector />);
      await waitFor(() => expect(mockFetchDocuments).toBeCalled());
      const productDropdown = wrapper.container.querySelectorAll('button')[0];
      userEvent.click(productDropdown);
      const productOption = await wrapper.findByText(product);
      userEvent.click(productOption);

      const versionDropdown = wrapper.container.querySelectorAll('button')[1];
      userEvent.click(versionDropdown);
      const versionOption = await wrapper.findByText(versionSelection);
      userEvent.click(versionOption);

      const button = await wrapper.findByTitle('View or Download Documentation');
      expect(button).toHaveAttribute('aria-disabled', 'false');
      expect(button.href).toEqual(expectedUrl);
    });
  });

  it('when the selected product has multiple deprecated versions, versions are sorted correctly', () => {
    const wrapper = render(<DeprecatedVersionSelector />);
    const productDropdown = wrapper.container.querySelectorAll('button')[0];
    userEvent.click(productDropdown);
    const product = wrapper.queryByText('MongoDB Manual');
    expect(product).toBeTruthy();
    userEvent.click(product);
    const versionDropdown = wrapper.container.querySelectorAll('button')[1];
    userEvent.click(versionDropdown);
    expect(versionDropdown).toHaveAttribute('aria-expanded', 'true');

    const versionChoices = wrapper.queryAllByRole('option').slice(3);

    const sortedManualChoices = [
      'Version 1.1',
      'Version 1.2',
      'Version 1.10',
      'Version 1.11',
      'Version 2.2',
      'Version 2.4',
      'Version 2.6',
      'Version 3.0',
      'Version 3.2',
      'Version 3.4',
    ];

    for (let version in versionChoices) {
      expect(versionChoices[version].textContent).toEqual(sortedManualChoices[version]);
    }
  });

  it('populates the dropdown using build-time data if atlas fails', () => {
    mockFetchDocuments.mockImplementation(async (dbName) => {
      return Promise.reject();
    });

    wrapper = render(<DeprecatedVersionSelector />);

    const productDropdown = wrapper.container.querySelectorAll('button')[0];
    userEvent.click(productDropdown);

    expect(wrapper.getByText('MongoDB Manual')).toBeTruthy();
    expect(wrapper.getByText('MongoDB Atlas Open Service Broker on Kubernetes')).toBeTruthy();
  });

  it('client-side fetchDocsets overwrites build-time data', async () => {
    useAllDocsets.mockImplementation(() => []);
    wrapper = render(<DeprecatedVersionSelector />);
    await waitFor(() => expect(mockFetchDocuments).toBeCalled());

    const productDropdown = wrapper.container.querySelectorAll('button')[0];
    userEvent.click(productDropdown);

    expect(wrapper.getByText('MongoDB Manual')).toBeTruthy();
    expect(wrapper.getByText('MongoDB Atlas Open Service Broker on Kubernetes')).toBeTruthy();
  });
});
