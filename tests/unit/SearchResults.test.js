// Tests for the search results page
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { tick } from '../utils';
import transformUrlBasedOnOrigin from '../../src/utils/transform-url-based-on-origin';
// Importing all specifically to use jest spyOn, mockImplementation for mocking
import * as reachRouter from '@reach/router';
import SearchResults from '../../src/components/SearchResults';
import { FILTERED_RESULT, mockMarianFetch, UNFILTERED_RESULT } from './utils/mock-marian-fetch';

// Check the search results include the property-filtered results
const expectFilteredResults = (wrapper) => {
  wrapper.getByText('Realm results for "stitch"');

  expect(wrapper.queryAllByText('Realm').length).toBe(1);

  // Check the search result card displays content according to the response
  expect(wrapper.queryAllByText(FILTERED_RESULT.title)).toBeTruthy();
  expect(wrapper.queryAllByText(FILTERED_RESULT.preview)).toBeTruthy();
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.title).length).toBe(0);

  // Check the result does link to the provided doc
  expect(wrapper.queryByText('stitch').closest('a')).toHaveProperty('href', `http://localhost/${FILTERED_RESULT.url}`);
  expect(wrapper.queryAllByText('Realm results for "stitch"').length).toBe(1);

  // Check the dropdowns are filled in
  expectValuesForFilters(wrapper, 'Realm', 'Latest');
};

const expectValuesForFilters = (wrapper, product, branch) => {
  expect(wrapper.queryByText(product)).toBeTruthy();
  expect(wrapper.queryByText(branch)).toBeTruthy();
};

// Check the search results match the expected unfiltered results
const expectUnfilteredResults = (wrapper) => {
  wrapper.getByText(`All search results for "stitch"`);

  expect(wrapper.queryAllByText('(no filters)').length).toBe(1);

  // Check the search result card displays content according to the response
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.title)).toBeTruthy();
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.preview)).toBeTruthy();
  expect(wrapper.queryAllByText(FILTERED_RESULT.title).length).toBe(0);

  // Check the result does link to the provided doc
  expect(wrapper.queryByText('stitch').closest('a')).toHaveProperty(
    'href',
    `http://localhost/${UNFILTERED_RESULT.url}`
  );
  expect(wrapper.queryAllByText('Realm results for "stitch"').length).toBe(0);

  // Check the dropdowns are not filled in
  expectValuesForFilters(wrapper, 'Select a Product', 'Select a Version');
};

// Mock the reach router useLocation hook
const mockLocation = (search) => jest.spyOn(reachRouter, 'useLocation').mockImplementation(() => ({ search }));

describe('Search Results Page', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    window.fetch = mockMarianFetch;
  });

  afterAll(() => {
    window.fetch = null;
  });

  it('renders correctly without browser', () => {
    mockLocation(null);
    const tree = render(<SearchResults />);
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders results from a given search term query param', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectUnfilteredResults(renderStitchResults);
  });

  it('considers a given search filter query param', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&searchProperty=realm-master');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectFilteredResults(renderStitchResults);
  });

  it('updates the page UI when a property is changed', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectUnfilteredResults(renderStitchResults);

    // Change the filters, which should change the shown results

    await act(async () => {
      const dropdown = renderStitchResults.queryAllByRole('listbox')[0];
      expect(dropdown).toHaveAttribute('aria-expanded', 'false');
      userEvent.click(dropdown);
      tick();
      userEvent.click(renderStitchResults.getByText('Realm'));
    });
    expectFilteredResults(renderStitchResults);
  });

  it('rewrites old urls to new ones and vice versa', async () => {
    const oldHosts = [
      'docs.mongodb.com',
      'docs.cloudmanager.mongodb.com',
      'docs.opsmanager.mongodb.com',
      'docs.cloudmanager.mongodb.com',
    ];
    const newHost = 'www.mongodb.com';

    const mapping = [
      [
        'https://docs.mongodb.com/manual/reference/parameters/#wiredtiger-parameters',
        'https://www.mongodb.com/docs/manual/reference/parameters/#wiredtiger-parameters',
      ],
      [
        'https://docs.cloudmanager.mongodb.com/tutorial/edit-host-authentication-credentials/',
        'https://www.mongodb.com/docs/cloud-manager/tutorial/edit-host-authentication-credentials/',
      ],
      [
        'https://docs.opsmanager.mongodb.com/tutorial/edit-host-authentication-credentials/',
        'https://www.mongodb.com/docs/ops-manager/tutorial/edit-host-authentication-credentials/',
      ],
      [
        'https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/language/#std-label-ref-language-analyzers',
        'https://www.mongodb.com/docs/atlas/reference/atlas-search/analyzers/language/#std-label-ref-language-analyzers',
      ],
    ];

    // New to old
    for (const host of oldHosts) {
      for (const pair of mapping) {
        expect(transformUrlBasedOnOrigin(pair[1], host)).toStrictEqual(pair[0]);
        expect(transformUrlBasedOnOrigin(pair[0], host)).toStrictEqual(pair[0]);
      }
    }

    // Old to new
    for (const pair of mapping) {
      expect(transformUrlBasedOnOrigin(pair[0], newHost)).toStrictEqual(pair[1]);
      expect(transformUrlBasedOnOrigin(pair[1], newHost)).toStrictEqual(pair[1]);
    }

    // Errors and unknown hosts should be an identity function
    expect(transformUrlBasedOnOrigin('https://example.com', 'https://example.com')).toStrictEqual(
      'https://example.com/'
    );
    expect(transformUrlBasedOnOrigin('foo-bar', newHost)).toStrictEqual('foo-bar');
  });
});
