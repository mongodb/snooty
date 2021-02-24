import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as Gatsby from 'gatsby';
import Searchbar from '../../src/components/Searchbar';
import { FILTERED_RESULT, mockMarianFetch, UNFILTERED_RESULT } from './utils/mock-marian-fetch';
import { getSearchbarResultsFromJSON } from '../../src/utils/get-searchbar-results-from-json';
import { searchParamsToURL } from '../../src/utils/search-params-to-url';
import { DOCS_URL } from '../../src/constants';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const setProject = project => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        project,
      },
    },
  }));
};

const getAdvancedFiltersPane = async () => {
  const searchbar = mount(
    <Searchbar
      isExpanded
      getResultsFromJSON={getSearchbarResultsFromJSON}
      searchParamsToURL={searchParamsToURL}
      shouldAutofocus
    />
  );
  // The searchbar debounces search calls to Marian, so we need to trigger the
  // timeout programatically for test consistensy
  await act(async () => {
    searchbar.find('input').simulate('change', { target: { value: 'stitch' } });
  });
  jest.runAllTimers();
  await searchbar.update();
  await act(async () => {
    await searchbar.update();
    // Need re-render for child array prop to update (shallow compare seems to fail)
    searchbar.mount();
    searchbar.find('FilterFooterButton').simulate('click');
  });
  const advancedFiltersPane = searchbar.find('AdvancedFiltersPane');
  return { advancedFiltersPane, searchbar };
};

const expectProductDropdownValues = (wrapper, productValue, versionValue) => {
  expect(
    wrapper
      .find('StyledCustomSelect')
      .at(0)
      .text()
  ).toContain(productValue);
  // Second filter should update automatically
  expect(
    wrapper
      .find('StyledCustomSelect')
      .at(1)
      .text()
  ).toContain(versionValue);
};

const fillInFilterDropdowns = async wrapper => {
  let firstDropdown = wrapper.find('StyledCustomSelect').at(0);
  firstDropdown.simulate('click');
  const firstChoice = wrapper.find('Option').at(0);
  await act(async () => {
    firstChoice.simulate('click');
  });
  await wrapper.update();
  expectProductDropdownValues(wrapper, 'Realm', 'Latest');
};

const checkSearchResult = (wrapper, result) => {
  const searchResult = wrapper.find('StyledSearchResult');
  expect(searchResult.length).toBe(1);
  expect(searchResult.exists());
  expect(searchResult.text()).toContain(result.title);
  expect(searchResult.text()).toContain(result.preview);
  return searchResult;
};

describe('Searchbar', () => {
  beforeAll(() => {
    window.fetch = mockMarianFetch;
    jest.useFakeTimers();
    setProject('bi-connector');
  });

  afterAll(() => {
    window.fetch = null;
  });

  it('renders correctly without browser', () => {
    const condensedTree = shallow(<Searchbar isExpanded={false} />);
    expect(condensedTree).toMatchSnapshot();
    const expandedTree = shallow(<Searchbar isExpanded />);
    expect(expandedTree).toMatchSnapshot();
  });

  it('renders search results given a query', async () => {
    const searchbar = mount(
      <Searchbar
        isExpanded
        getResultsFromJSON={getSearchbarResultsFromJSON}
        searchParamsToURL={searchParamsToURL}
        shouldAutofocus
      />
    );
    await act(async () => {
      searchbar.find('input').simulate('change', { target: { value: 'stitch' } });
    });
    jest.runAllTimers();
    await searchbar.update();
    await act(async () => {
      await searchbar.update();
      expect(searchbar.find('input').props().value).toEqual('stitch');
      // Need re-render for child array prop to update (shallow compare seems to fail)
      searchbar.mount();
    });
    const searchResult = checkSearchResult(searchbar, UNFILTERED_RESULT);
    const searchResultLink = searchResult.find('SearchResultLink').at(0);
    expect(searchResultLink.props()).toHaveProperty('href', UNFILTERED_RESULT.url);
  });

  it('should not apply filters when the back button is clicked', async () => {
    const { advancedFiltersPane, searchbar } = await getAdvancedFiltersPane();
    let backButton = advancedFiltersPane.find('StyledReturnButton');
    backButton.simulate('click');
    await searchbar.update();
    expect(searchbar.find('SearchResultsContainer').exists());

    // Ensure no filters are applied
    checkSearchResult(searchbar, UNFILTERED_RESULT);

    // Change a filter and expect the unfiltered responses to show if we use the back button
    await act(async () => {
      searchbar.find('FilterFooterButton').simulate('click');
    });
    await searchbar.update();

    await fillInFilterDropdowns(searchbar);

    backButton = advancedFiltersPane.find('StyledReturnButton');
    backButton.simulate('click');
    await searchbar.update();

    // At this point, since we hit the back button the filters should not have been applied
    checkSearchResult(searchbar, UNFILTERED_RESULT);
  });

  it('should apply filters and update results', async () => {
    const { searchbar } = await getAdvancedFiltersPane();
    expectProductDropdownValues(searchbar, 'Select a Product', 'Select a Version');
    let firstDropdown = searchbar.find('StyledCustomSelect').at(0);
    firstDropdown.simulate('click');
    const firstChoice = searchbar.find('Option').at(0);
    await act(async () => {
      firstChoice.simulate('click');
    });
    await searchbar.update();
    expectProductDropdownValues(searchbar, 'Realm', 'Latest');

    const applyButton = searchbar.find('FilterFooterButton');
    expect(applyButton.text()).toBe('Apply Search Criteria (2)');
    await act(async () => {
      applyButton.simulate('click');
      // Re-running a debounced search, so we must trigger the timeout
      jest.runAllTimers();
    });
    await searchbar.update();

    // At this point, we should see the filtered result
    checkSearchResult(searchbar, FILTERED_RESULT);
  });

  it('should reset filters', async () => {
    const { searchbar } = await getAdvancedFiltersPane();
    let firstDropdown = searchbar.find('StyledCustomSelect').at(0);
    firstDropdown.simulate('click');
    const firstChoice = searchbar.find('Option').at(0);
    await act(async () => {
      firstChoice.simulate('click');
    });
    await searchbar.update();

    const applyButton = searchbar.find('FilterFooterButton');
    expect(applyButton.text()).toBe('Apply Search Criteria (2)');
    await act(async () => {
      applyButton.simulate('click');
      // Re-running a debounced search, so we must trigger the timeout
      jest.runAllTimers();
    });
    await searchbar.update();

    // At this point, we should see the filtered result
    checkSearchResult(searchbar, FILTERED_RESULT);
    searchbar.find('FilterFooterButton').simulate('click');
    await searchbar.update();
    await act(async () => {
      searchbar.find('FilterResetButton').simulate('click');
      // Re-running a debounced search, so we must trigger the timeout
      jest.runAllTimers();
    });
    expectProductDropdownValues(searchbar, 'Select a Product', 'Select a Version');
    await act(async () => {
      searchbar.find('FilterFooterButton').simulate('click');
      // Re-running a debounced search, so we must trigger the timeout
      jest.runAllTimers();
    });
    await searchbar.update();
    checkSearchResult(searchbar, UNFILTERED_RESULT);
  });

  it('should properly update the go button href on query changes', async () => {
    const searchbar = mount(
      <Searchbar
        isExpanded
        getResultsFromJSON={getSearchbarResultsFromJSON}
        searchParamsToURL={searchParamsToURL}
        shouldAutofocus
      />
    );
    // The go button does not render if there is no search query yet
    expect(!searchbar.exists('GoButton'));

    await act(async () => {
      searchbar.find('input').simulate('change', { target: { value: 'stitch' } });
    });
    jest.runAllTimers();
    await searchbar.update();
    await act(async () => {
      await searchbar.update();
      // Need re-render for child array prop to update (shallow compare seems to fail)
      searchbar.mount();
    });
    expect(searchbar.exists('GoButton'));
    expect(searchbar.find('GoButton').props()).toHaveProperty('href', `${DOCS_URL}/search?q=stitch`);
    await act(async () => {
      searchbar.find('FilterFooterButton').simulate('click');
    });
    await searchbar.update();
    await fillInFilterDropdowns(searchbar);
    const applyButton = searchbar.find('FilterFooterButton');
    expect(applyButton.text()).toBe('Apply Search Criteria (2)');
    await act(async () => {
      applyButton.simulate('click');
      // Re-running a debounced search, so we must trigger the timeout
      jest.runAllTimers();
    });
    expect(searchbar.find('GoButton').props()).toHaveProperty(
      'href',
      `${DOCS_URL}/search?q=stitch&searchProperty=realm-master`
    );
  });
});

describe('Searchbar on Realm', () => {
  beforeAll(() => {
    window.fetch = mockMarianFetch;
    jest.useFakeTimers();
    setProject('realm');
  });

  afterAll(() => {
    window.fetch = null;
  });

  it('should apply the Realm product filter by default', async () => {
    const searchbar = mount(
      <Searchbar
        isExpanded
        getResultsFromJSON={getSearchbarResultsFromJSON}
        searchParamsToURL={searchParamsToURL}
        shouldAutofocus
      />
    );
    await act(async () => {
      searchbar.find('input').simulate('change', { target: { value: 'stitch' } });
    });
    jest.runAllTimers();
    await searchbar.update();
    await act(async () => {
      await searchbar.update();
      expect(searchbar.find('input').props().value).toEqual('stitch');
      // Need re-render for child array prop to update (shallow compare seems to fail)
      searchbar.mount();
    });
    const searchResult = checkSearchResult(searchbar, FILTERED_RESULT);
    const searchResultLink = searchResult.find('SearchResultLink').at(0);
    expect(searchResultLink.props()).toHaveProperty('href', FILTERED_RESULT.url);
  });
});
