// Tests for the search results page
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as hooks from '@reach/router';
import SearchResults from '../../src/components/SearchResults';
import { mockMarianFetch } from './utils/mock-marian-fetch';

describe('Search Results Page', () => {
  beforeAll(() => {
    window.fetch = mockMarianFetch;
  });
  afterAll(() => {
    window.fetch = null;
  });
  it('renders correctly without browser', () => {
    jest.spyOn(hooks, 'useLocation').mockImplementation(() => ({ search: null }));
    const tree = shallow(<SearchResults />);
    expect(tree).toMatchSnapshot();
  });

  it('renders results from a given search term query param', async () => {
    let renderStitchResults;
    jest.spyOn(hooks, 'useLocation').mockImplementation(() => ({ search: '?q=stitch' }));
    await act(async () => {
      renderStitchResults = mount(<SearchResults />);
    });

    await renderStitchResults.update();

    expect(renderStitchResults.find('StyledSearchResult').length).toBe(1);
    const searchResult = renderStitchResults.find('StyledSearchResult').at(0);

    // Check the search result card displays content according to the response
    expect(searchResult.exists());
    expect(searchResult.text()).toContain('stitch (no filters)');
    expect(searchResult.text()).toContain('Stitch preview (no filters)');

    // Check the result does link to the provided doc
    const searchResultLink = searchResult.find('SearchResultLink').at(0);
    expect(searchResultLink.props()).toHaveProperty('href', 'stitch.nofilters');
  });
  it('considers a given search filter query param', async () => {
    let renderStitchResults;
    jest.spyOn(hooks, 'useLocation').mockImplementation(() => ({ search: '?q=stitch&searchProperty=realm-master' }));
    await act(async () => {
      renderStitchResults = mount(<SearchResults />);
    });

    await renderStitchResults.update();

    expect(renderStitchResults.find('StyledSearchResult').length).toBe(1);
    const searchResult = renderStitchResults.find('StyledSearchResult').at(0);

    // Check the search result card displays content according to the response
    expect(searchResult.exists());
    expect(searchResult.text()).toContain('stitch (realm filter)');
    expect(searchResult.text()).toContain('Stitch preview (with realm filter)');

    // Check the result does link to the provided doc
    const searchResultLink = searchResult.find('SearchResultLink').at(0);
    expect(searchResultLink.props()).toHaveProperty('href', 'stitch.withfilters');
  });

  it('updates the page UI when a property is chosen/changed', async () => {
    let renderStitchResults;
    jest.spyOn(hooks, 'useLocation').mockImplementation(() => ({ search: '?q=stitch&searchProperty=realm-master' }));
    await act(async () => {
      renderStitchResults = mount(<SearchResults />);
    });
    await renderStitchResults.update();
    expect(renderStitchResults.text()).toContain('Realm results for "stitch"');
    expect(
      renderStitchResults
        .find('Select')
        .at(0)
        .text()
    ).toContain('Realm');
    expect(
      renderStitchResults
        .find('Select')
        .at(1)
        .text()
    ).toContain('master');
  });
});
