import React from 'react';
import { render } from '@testing-library/react';
import * as Gatsby from 'gatsby';
import * as ReachRouter from '@gatsbyjs/reach-router';
import * as BrowserStorage from '../../src/utils/browser-storage';
import ComposableTutorial from '../../src/components/ComposableTutorial/ComposableTutorial';

import { ComposableTutorialNode } from '../../src/types/ast';
import ComposableData from './data/Composable.test.json';

const renderComposable = () => render(<ComposableTutorial nodeData={ComposableData as ComposableTutorialNode} />);

// mock local storage, location (query params), and navigate fn
const mockedGetLocalValue = jest.spyOn(BrowserStorage, 'getLocalValue');
const mockedNavigate = jest.spyOn(Gatsby, 'navigate');
const mockedUseLocation = jest.spyOn(ReachRouter, 'useLocation') as jest.SpyInstance<Partial<Location>>;

jest.mock('../../src/context/chatbot-context', () => ({
  useChatbotModal: () => ({
    chatbotClicked: false,
    setChatbotClicked: jest.fn(),
    text: '',
    setText: jest.fn(),
  }),
  ChatbotProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Composable Tutorial component', () => {
  beforeEach(() => {
    mockedGetLocalValue.mockReset();
    mockedNavigate.mockReset();
  });

  it('navigates to default selections without local storage or url query params', async () => {
    renderComposable();
    expect(mockedNavigate).toHaveBeenCalledWith(
      '?interface=driver&language=nodejs&deployment-type=atlas&operator=queryString',
      { state: { preserveScroll: true } }
    );
  });

  it('reads from local storage if available', () => {
    // mock local storage
    // wait for render
    // check to see if navigate has been called with mocked local storage
    mockedGetLocalValue.mockReturnValueOnce({
      'deployment-type': 'self',
      interface: 'atlas-admin-api',
      operator: 'autocomplete',
    });
    renderComposable();
    expect(mockedNavigate).toHaveBeenCalledWith(
      '?deployment-type=self&interface=atlas-admin-api&operator=autocomplete',
      { state: { preserveScroll: true } }
    );
  });

  it('prioritizes query params over local storage if correct selections', () => {
    // mock local storage
    mockedGetLocalValue.mockReturnValueOnce({
      'deployment-type': 'self',
      interface: 'atlas-admin-api',
      operator: 'autocomplete',
    });
    // mock query params / location
    mockedUseLocation.mockReturnValueOnce({
      pathname: 'test-pathname',
      search: '?deployment-type=atlas&interface=driver&language=c&operator=queryString',
    });

    // wait for render
    const wrapper = renderComposable();
    expect(wrapper.asFragment()).toMatchSnapshot();
    // check to see content is visible
    expect(wrapper.findByDisplayValue('queryString')).toBeTruthy();
    expect(wrapper.findByDisplayValue('Language')).toBeTruthy();
  });

  it('removes incorrect query params', () => {
    // mock local value
    mockedGetLocalValue.mockReturnValueOnce({
      'deployment-type': 'self',
      interface: 'atlas-admin-api',
      operator: 'autocomplete',
    });
    // mock query params / location with unnecessary language selection (dependent on interface = drivers)
    mockedUseLocation.mockReturnValueOnce({
      pathname: 'test-pathname',
      search: '?deployment-type=atlas&interface=atlas-admin-api&language=c&operator=queryString',
    });

    renderComposable();

    // removed bad selection of language
    expect(mockedNavigate).toHaveBeenCalledWith(
      '?deployment-type=self&interface=atlas-admin-api&operator=autocomplete',
      { state: { preserveScroll: true } }
    );
  });
});
