// Tests for the search results page
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
// Importing all specifically to use jest spyOn, mockImplementation for mocking
import * as reachRouter from '@reach/router';
import SearchResults from '../../src/components/SearchResults';
import { FILTERED_RESULT, mockMarianFetch, UNFILTERED_RESULT } from './utils/mock-marian-fetch';

// Check the search results include the property-filtered results
const expectFilteredResults = (wrapper) => {
  expect(wrapper.find('StyledSearchResult').length).toBe(1);
  const searchResult = wrapper.find('StyledSearchResult').at(0);

  // Check the search result card displays content according to the response
  expect(searchResult.exists());
  expect(searchResult.text()).toContain(FILTERED_RESULT.title);
  expect(searchResult.text()).toContain(FILTERED_RESULT.preview);
  expect(searchResult.text()).not.toContain(UNFILTERED_RESULT.title);

  // Check the result does link to the provided doc
  const searchResultLink = searchResult.find('SearchResultLink').at(0);
  expect(searchResultLink.props()).toHaveProperty('href', FILTERED_RESULT.url);
  expect(wrapper.text()).toContain('Realm results for "stitch"');

  // Check the dropdowns are filled in
  expectValuesForFilters(wrapper, 'Realm', 'Latest');
};

const expectValuesForFilters = (wrapper, product, branch) => {
  expect(wrapper.find('Select').at(0).text()).toContain(product);
  expect(wrapper.find('Select').at(1).text()).toContain(branch);
};

// Check the search results match the expected unfiltered results
const expectUnfilteredResults = (wrapper) => {
  expect(wrapper.find('StyledSearchResult').length).toBe(1);
  const searchResult = wrapper.find('StyledSearchResult').at(0);

  // Check the search result card displays content according to the response
  expect(searchResult.exists());
  expect(searchResult.text()).toContain(UNFILTERED_RESULT.title);
  expect(searchResult.text()).toContain(UNFILTERED_RESULT.preview);
  expect(searchResult.text()).not.toContain(FILTERED_RESULT.title);

  // Check the result does link to the provided doc
  const searchResultLink = searchResult.find('SearchResultLink').at(0);
  expect(searchResultLink.props()).toHaveProperty('href', UNFILTERED_RESULT.url);
  expect(wrapper.text()).not.toContain('Realm');

  // Check the dropdowns are not filled in
  expectValuesForFilters(wrapper, 'Select a Product', 'Select a Version');
};

// Mock the reach router useLocation hook
const mockLocation = (search) => jest.spyOn(reachRouter, 'useLocation').mockImplementation(() => ({ search }));

describe('Search Results Page', () => {
  beforeAll(() => {
    window.fetch = mockMarianFetch;
  });

  afterAll(() => {
    window.fetch = null;
  });

  it('renders correctly without browser', () => {
    mockLocation(null);
    const tree = shallow(<SearchResults />);
    expect(tree).toMatchSnapshot();
  });

  it('renders results from a given search term query param', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = mount(<SearchResults />);
    });
    await renderStitchResults.update();
    expectUnfilteredResults(renderStitchResults);
  });

  it('considers a given search filter query param', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch&searchProperty=realm-master');
    await act(async () => {
      renderStitchResults = mount(<SearchResults />);
    });

    await renderStitchResults.update();
    expectFilteredResults(renderStitchResults);
  });

  it('updates the page UI when a property is changed', async () => {
    let renderStitchResults;
    mockLocation('?q=stitch');
    await act(async () => {
      renderStitchResults = mount(<SearchResults />);
    });
    await renderStitchResults.update();
    expectUnfilteredResults(renderStitchResults);

    // Change the filters, which should change the shown results
    let firstDropdown = renderStitchResults.find('StyledCustomSelect').at(0);
    firstDropdown.simulate('click');
    const firstChoice = renderStitchResults.find('Option').at(0);
    await act(async () => {
      firstChoice.simulate('click');
    });
    await renderStitchResults.update();

    expectFilteredResults(renderStitchResults);
  });
});
