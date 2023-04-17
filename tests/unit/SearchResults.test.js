// Tests for the search results page
import React from 'react';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
// Importing all specifically to use jest spyOn, mockImplementation for mocking
import { mockLocation } from '../utils/mock-location';
import { tick, setMobile } from '../utils';
import SearchResults from '../../src/components/SearchResults';
import mockStaticQuery from '../utils/mockStaticQuery';
import * as RealmUtil from '../../src/utils/realm';
import mockInputData from '../utils/data/marian-manifests.json';
import { FILTERED_RESULT, mockMarianFetch, UNFILTERED_RESULT } from './utils/mock-marian-fetch';

const MOBILE_SEARCH_BACK_BUTTON_TEXT = 'Back to search results';

// Check the search results include the property-filtered results
const expectFilteredResults = (wrapper, filteredByRealm) => {
  // Filtered property "Realm" should be shown 3 or 4x:
  // (1) as the selected text in the dropdown, (2) as a tag below the search header, (3) as a tag on the search result
  // and (4) if it selected within the dropdown
  const expectedRealmCount = filteredByRealm ? 4 : 3;
  // Version "Latest" should be shown 3x:
  // (1) as the selected text in the dropdown, (2) as a tag below the search header, (3) as a tag on the search result
  expect(wrapper.queryAllByText('Realm').length).toBe(expectedRealmCount);
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

// filters are not shown until dropdown is opened
// open filters by clicking select buttons first
const expectValuesForFilters = (wrapper, category, version) => {
  const selectElements = wrapper.queryAllByTestId('lg-select');

  expect(selectElements[0].textContent).toBe(category);
  expect(selectElements[1].textContent).toBe(version);
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

const filterByRealm = async (wrapper, screenSize) => {
  let listboxIndex = 0;
  if (screenSize === 'mobile') {
    listboxIndex = 2;
  }
  const selectElements = wrapper.queryAllByTestId('lg-select');
  const dropdownButton = selectElements[listboxIndex];
  expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
  userEvent.click(dropdownButton);
  await tick();
  const dropdownList = wrapper.queryAllByRole('listbox')[0];
  userEvent.click(within(dropdownList).getByText('Realm'));
  await tick();
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
  mockStaticQuery();
  jest.spyOn(RealmUtil, 'fetchSearchPropertyMapping').mockImplementation(() => mockInputData.searchPropertyMapping);

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
    await filterByRealm(renderStitchResults);
    expectFilteredResults(renderStitchResults, true);
  });

  it('resets search filters when hitting the "clear all filters" button', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = render(<SearchResults />);
    });
    expectUnfilteredResults(renderStitchResults);

    // Change filters
    await filterByRealm(renderStitchResults);
    expectFilteredResults(renderStitchResults, true);

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
    // Filter using listbox at index 2, which should appear on mobile
    await filterByRealm(renderStitchResults, 'mobile');
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
    await filterByRealm(renderStitchResults, 'mobile');
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
});
