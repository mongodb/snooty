// Tests for the search results page
import * as gatsby from 'gatsby';
import React from 'react';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
// Importing all specifically to use jest spyOn, mockImplementation for mocking
import { mockLocation } from '../utils/mock-location';
import { tick, setMobile } from '../utils';
import SearchResults from '../../src/components/SearchResults/SearchResults';
import { SearchContextProvider } from '../../src/components/SearchResults/SearchContext';
import mockStaticQuery from '../utils/mockStaticQuery';
import * as searchPropertyMappingApi from '../../src/utils/search-property-mapping';
import mockInputData from '../utils/data/marian-manifests.json';
import { FILTERED_RESULT, mockMarianFetch, UNFILTERED_RESULT } from './utils/mock-marian-fetch';

const MOBILE_SEARCH_BACK_BUTTON_TEXT = 'Back to search results';

// Mock LG Checkbox component to avoid potential React incompatibilities with testing:
// "Error: Uncaught [TypeError: e.addEventListener is not a function]"
jest.mock('@leafygreen-ui/checkbox', () => {
  return ({ label, checked, indeterminate }) => (
    <div data-checked={checked} data-indeterminate={indeterminate}>
      {label}
    </div>
  );
});

// Check the search results include the property-filtered results
const expectFilteredResults = (wrapper) => {
  // (1) as a tag below the search header, (2) as a tag on the search result
  // and (3) as the selected text in the dropdown
  expect(wrapper.queryAllByText('Realm').length).toBe(3);
  // Version "Latest" should be shown 3x:
  // (1) as the selected text in the dropdown, (2) as a tag below the search header, (3) as a tag on the search result
  expect(wrapper.queryAllByText('Latest').length).toBe(3);

  // Check the search result card displays content according to the response
  expect(wrapper.queryAllByText(FILTERED_RESULT.title)).toBeTruthy();
  expect(wrapper.queryAllByText(FILTERED_RESULT.preview)).toBeTruthy();
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.title).length).toBe(0);

  // Check the result does link to the provided doc
  expect(wrapper.queryAllByText(/stitch/)[1].closest('a')).toHaveProperty(
    'href',
    `http://localhost/${FILTERED_RESULT.url}/`
  );

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
  expect(wrapper.queryAllByText(/no filters/).length).toBe(2);

  // Check the search result card displays content according to the response
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.title)).toBeTruthy();
  expect(wrapper.queryAllByText(UNFILTERED_RESULT.preview)).toBeTruthy();
  expect(wrapper.queryAllByText(FILTERED_RESULT.title).length).toBe(0);

  // Check the result does link to the provided doc
  expect(wrapper.queryAllByText(/stitch/)[1].closest('a')).toHaveProperty(
    'href',
    `http://localhost/${UNFILTERED_RESULT.url}/`
  );

  // Check the dropdowns are not filled in
  expectValuesForFilters(wrapper, 'Filter by Category', 'Filter by Version');
};

const filterByRealm = async (wrapper, screenSize) => {
  const listboxIndex = 0;
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
  const refineSearchButton = wrapper.queryAllByText('Refine your search')[0].closest('button');
  userEvent.click(refineSearchButton);
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

function renderSearchResults(props) {
  return render(
    <SearchContextProvider showFacets={props?.showFacets}>
      <SearchResults />
    </SearchContextProvider>
  );
}

describe('Search Results Page', () => {
  jest.useFakeTimers();
  let navigateSpy;

  beforeEach(() => {
    mockStaticQuery();
    jest
      .spyOn(searchPropertyMappingApi, 'fetchSearchPropertyMapping')
      .mockImplementation(() => mockInputData.searchPropertyMapping);
    navigateSpy = jest.spyOn(gatsby, 'navigate').mockImplementation((...args) => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => {
    window.fetch = mockMarianFetch;
  });

  afterAll(() => {
    window.fetch = null;
  });

  it('renders correctly without browser', async () => {
    mockLocation(null);
    let tree;
    await act(async () => {
      tree = renderSearchResults();
    });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('renders loading images before returning nonempty results', async () => {
    let renderLoadingSkeletonImgs;
    mockLocation('?q=stitch');
    renderLoadingSkeletonImgs = renderSearchResults();
    expect(renderLoadingSkeletonImgs.asFragment()).toMatchSnapshot();
  });

  it('renders loading images before returning no results', async () => {
    let renderLoadingSkeletonImgs;
    mockLocation('?q=noresultsreturned');
    renderLoadingSkeletonImgs = renderSearchResults();
    expect(renderLoadingSkeletonImgs.asFragment()).toMatchSnapshot();
  });

  it('renders no results found correctly if query returns nothing', async () => {
    let renderEmptyResults;
    mockLocation('?q=noresultsreturned');
    await act(async () => {
      renderEmptyResults = renderSearchResults();
    });
    expect(renderEmptyResults.queryAllByText('No results found')).toBeTruthy();
  });

  it('renders search landing page if no query made', async () => {
    let renderSearchLanding;
    mockLocation('');
    await act(async () => {
      renderSearchLanding = renderSearchResults();
    });
    expect(renderSearchLanding.queryAllByText('Search MongoDB Documentation')).toBeTruthy();
  });

  it('renders results from a given search term query param and displays category and version tags', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&page=1');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });
    expect(renderStitchResults.asFragment()).toMatchSnapshot();
    expectUnfilteredSearchResultTags(renderStitchResults);
    expectUnfilteredResults(renderStitchResults);
  });

  it('considers a given search filter query param and displays category and version tags', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&page=1&searchProperty=realm-master');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });
    expect(renderStitchResults.asFragment()).toMatchSnapshot();
    expectFilteredResults(renderStitchResults);
  });

  it('does not return results for a given search term with an ill-formed searchProperty', async () => {
    let renderStitchResults;
    mockLocation('?q=realm');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });
    expect(renderStitchResults.asFragment()).toMatchSnapshot();
    expect(renderStitchResults.queryAllByText(/No results found/).length).toBe(1);
  });

  it('navigates to a new page with updated query parameters when a property is changed', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&page=1');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });

    expectUnfilteredResults(renderStitchResults);

    // Change the filters, which should change the shown results
    await filterByRealm(renderStitchResults);
    const expectedQuery = '?q=stitch&page=1&searchProperty=realm-master';
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy.mock.calls[0]?.[0]).toEqual(expectedQuery);
  });

  it('navigates with new search query parameters when hitting the "clear all filters" button', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&page=1&searchProperty=realm-master');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });
    expectFilteredResults(renderStitchResults);

    await act(async () => {
      await clearAllFilters(renderStitchResults);
    });
    const expectedQuery = '?q=stitch&page=1';
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy.mock.calls[0]?.[0]).toEqual(expectedQuery);
  });

  it('specifies search filters through mobile', async () => {
    let renderStitchResults;
    setMobile();
    mockLocation('?q=stitch&page=1');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });
    expectUnfilteredResults(renderStitchResults);

    // Open mobile search options
    await act(async () => {
      await openMobileSearch(renderStitchResults);
    });
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeTruthy();

    // Apply filters
    await filterByRealm(renderStitchResults, 'mobile');
    await act(async () => {
      const applyFiltersButton = renderStitchResults.getByText('Apply filters').closest('button');
      userEvent.click(applyFiltersButton);
      tick();
    });
    const expectedQuery = '?q=stitch&page=1&searchProperty=realm-master';
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy.mock.calls[0]?.[0]).toEqual(expectedQuery);
  });

  it('cancels search filter application on mobile', async () => {
    let renderStitchResults;
    setMobile();
    mockLocation('?q=stitch&page=1');
    await act(async () => {
      renderStitchResults = renderSearchResults();
    });
    expectUnfilteredResults(renderStitchResults);

    // Open mobile search options
    await act(async () => {
      await openMobileSearch(renderStitchResults);
    });
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeTruthy();

    // Set filters but don't apply them
    await filterByRealm(renderStitchResults, 'mobile');

    // Hit back button
    await act(async () => {
      const backButton = renderStitchResults.getByText(MOBILE_SEARCH_BACK_BUTTON_TEXT);
      userEvent.click(backButton);
      tick();
    });
    expectUnfilteredResults(renderStitchResults);
    expect(renderStitchResults.queryByText(MOBILE_SEARCH_BACK_BUTTON_TEXT)).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });

  // Note that snapshots might not be entirely accurate due to mocked LG component
  describe('Facets component', () => {
    const facetsContainerId = 'facets-container';

    it('renders all facets', async () => {
      let tree;
      mockLocation('?q=test&page=1');
      await act(async () => {
        tree = renderSearchResults({ showFacets: true });
      });
      expect(tree.getByTestId(facetsContainerId)).toMatchSnapshot();
    });

    it('renders facets with selected values', async () => {
      let tree;
      mockLocation('?q=test&page=1&facets.genre=tutorial&facets.target_product>atlas>sub_product=atlas-cli');
      await act(async () => {
        tree = renderSearchResults({ showFacets: true });
      });
      const facetsContainer = tree.getByTestId(facetsContainerId);
      // Check that the number of checked items match the number of facets in mocked location
      const numFacetsSelected = 2;
      const numFacetsIndeterminate = 1;
      expect(facetsContainer.querySelectorAll('[data-checked=true]')).toHaveLength(numFacetsSelected);
      expect(facetsContainer.querySelectorAll('[data-indeterminate=true]')).toHaveLength(numFacetsIndeterminate);
      expect(tree.getByTestId(facetsContainerId)).toMatchSnapshot();
    });
  });
});
