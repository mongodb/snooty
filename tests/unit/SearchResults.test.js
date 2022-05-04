// Tests for the search results page
import React from 'react';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { tick, setMobile } from '../utils';
import transformUrlBasedOnOrigin from '../../src/utils/transform-url-based-on-origin';
// Importing all specifically to use jest spyOn, mockImplementation for mocking
import * as reachRouter from '@reach/router';
import SearchResults from '../../src/components/SearchResults';
import { FILTERED_RESULT, mockMarianFetch, UNFILTERED_RESULT } from './utils/mock-marian-fetch';

const MOBILE_SEARCH_BACK_BUTTON_TEXT = 'Back to search results';

// Check the search results include the property-filtered results
const expectFilteredResults = (wrapper) => {
  // Filtered property "Realm" and version "Latest" should be shown 3x:
  // (1) as the selected text in the dropdown, (2) as a tag below the search header, (3) as a tag on the search result
  expect(wrapper.queryAllByText('Realm').length).toBe(3);
  expect(wrapper.queryAllByText('Latest').length).toBe(3);

  // Check the search result card displays content according to the response
  expect(wrapper.queryAllByText(FILTERED_RESULT.title)).toBeTruthy();
  expect(wrapper.queryAllByText(FILTERED_RESULT.preview)).toBeTruthy();
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.title).length).toBe(0);

  // Check the result does link to the provided doc
  expect(wrapper.queryByText('stitch').closest('a')).toHaveProperty('href', `http://localhost/${FILTERED_RESULT.url}`);
  expect(wrapper.queryAllByText('Search results for "stitch"').length).toBe(1);

  // Check the dropdowns are filled in
  expectValuesForFilters(wrapper, 'Realm', 'Latest');
};

const expectValuesForFilters = (wrapper, category, version) => {
  const dropdowns = wrapper.queryAllByRole('listbox');
  expect(within(dropdowns[0]).queryByText(category)).toBeTruthy();
  expect(within(dropdowns[1]).queryByText(version)).toBeTruthy();
};

// Unfiltered search results should still display tags for category and version on card
const expectUnfilteredSearchResultTags = (wrapper) => {
  expect(wrapper.queryAllByText('Realm').length).toBe(1);
  expect(wrapper.queryAllByText('Latest').length).toBe(1);
};

// Check the search results match the expected unfiltered results
const expectUnfilteredResults = (wrapper) => {
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

  // We always show this text, regardless of filter
  expect(wrapper.queryAllByText('Search results for "stitch"').length).toBe(1);

  // Check the dropdowns are not filled in
  expectValuesForFilters(wrapper, 'Filter by Category', 'Filter by Version');
};

// Mock the reach router useLocation hook
const mockLocation = (search) => jest.spyOn(reachRouter, 'useLocation').mockImplementation(() => ({ search }));

const filterByRealm = async (wrapper, screenSize) => {
  let listboxIndex = 0;
  if (screenSize === 'mobile') {
    listboxIndex = 2;
  }
  const dropdown = wrapper.queryAllByRole('listbox')[listboxIndex];
  expect(dropdown).toHaveAttribute('aria-expanded', 'false');
  userEvent.click(dropdown);
  tick();
  userEvent.click(within(dropdown).getByText('Realm'));
};

const openMobileSearch = async (wrapper) => {
  const specifySearchButton = wrapper.queryAllByText('Specify your search')[0].closest('button');
  userEvent.click(specifySearchButton);
  tick();
};

const clearAllFilters = async (wrapper, screenSize) => {
  // Default to desktop; desktop button appears in index 1
  let queryIndex = 1;
  if (screenSize === 'mobile') {
    queryIndex = 0;
  }

  const clearAllFiltersButton = wrapper.queryAllByText('Clear all filters')[queryIndex].closest('button');
  userEvent.click(clearAllFiltersButton);
  tick();
};

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

  it('renders loading images before returning nonempty results', async () => {
    let renderLoadingSkeletonImgs;
    mockLocation('?q=stitch');
    renderLoadingSkeletonImgs = render(<SearchResults />);
    expect(renderLoadingSkeletonImgs.asFragment()).toMatchSnapshot();
  });

  it('renders loading images before returning no results', async () => {
    let renderLoadingSkeletonImgs;
    mockLocation('?q=noresultsreturned');
    renderLoadingSkeletonImgs = render(<SearchResults />);
    expect(renderLoadingSkeletonImgs.asFragment()).toMatchSnapshot();
  });

  it('renders no results found correctly if query returns nothing', async () => {
    let renderEmptyResults;
    mockLocation('?q=noresultsreturned');
    await act(async () => {
      renderEmptyResults = render(<SearchResults />);
    });
    expect(renderEmptyResults.queryAllByText('No results found')).toBeTruthy();
  });

  it('renders search landing page if no query made', async () => {
    let renderSearchLanding;
    mockLocation('');
    await act(async () => {
      renderSearchLanding = render(<SearchResults />);
    });
    expect(renderSearchLanding.queryAllByText('Search MongoDB Documentation')).toBeTruthy();
  });

  it('renders results from a given search term query param and displays category and version tags', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expect(renderStitchResults.asFragment()).toMatchSnapshot();
    expectUnfilteredSearchResultTags(renderStitchResults);
    expectUnfilteredResults(renderStitchResults);
  });

  it('considers a given search filter query param and displays category and version tags', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&searchProperty=realm-master');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expect(renderStitchResults.asFragment()).toMatchSnapshot();
    expectFilteredResults(renderStitchResults);
  });

  it('does not return results for a given search term with an ill-formed searchProperty', async () => {
    let renderStitchResults;
    mockLocation('?q=realm');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expect(renderStitchResults.asFragment()).toMatchSnapshot();
    expect(renderStitchResults.queryAllByText('No results found. Please search again.').length).toBe(1);
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
      await filterByRealm(renderStitchResults);
    });
    expectFilteredResults(renderStitchResults);
  });

  it('resets search filters when hitting the "clear all filters" button', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectUnfilteredResults(renderStitchResults);

    // Change filters
    await act(async () => {
      await filterByRealm(renderStitchResults);
    });
    expectFilteredResults(renderStitchResults);

    // Remove filters
    await act(async () => {
      await clearAllFilters(renderStitchResults);
    });
    expectUnfilteredResults(renderStitchResults);
  });

  it('specifies search filters through mobile', async () => {
    let renderStitchResults;
    setMobile();
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectUnfilteredResults(renderStitchResults);

    // Open mobile search options
    await act(async () => {
      await openMobileSearch(renderStitchResults);
    });
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeTruthy();

    // Set filters but don't apply them
    await act(async () => {
      // Filter using listbox at index 2, which should appear on mobile
      await filterByRealm(renderStitchResults, 'mobile');
    });
    expectUnfilteredResults(renderStitchResults);
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeTruthy();

    // Apply filters
    await act(async () => {
      const applyFiltersButton = renderStitchResults.getByText('Apply filters').closest('button');
      userEvent.click(applyFiltersButton);
      tick();
    });
    expectFilteredResults(renderStitchResults);
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeFalsy();

    // Remove filters
    await act(async () => {
      await clearAllFilters(renderStitchResults, 'mobile');
    });
    expectUnfilteredResults(renderStitchResults);
  });

  it('cancels search filter application on mobile', async () => {
    let renderStitchResults;
    setMobile();
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectUnfilteredResults(renderStitchResults);

    // Open mobile search options
    await act(async () => {
      await openMobileSearch(renderStitchResults);
    });
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeTruthy();

    // Set filters but don't apply them
    await act(async () => {
      await filterByRealm(renderStitchResults, 'mobile');
    });
    expectUnfilteredResults(renderStitchResults);
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeTruthy();

    // Hit back button
    await act(async () => {
      const backButton = renderStitchResults.getByText(MOBILE_SEARCH_BACK_BUTTON_TEXT);
      userEvent.click(backButton);
      tick();
    });
    expectUnfilteredResults(renderStitchResults);
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeFalsy();
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
