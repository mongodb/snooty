import React from 'react';
import { render } from '@testing-library/react';
import mockData from './data/Chapters.test.json';
import GuideNext from '../../src/components/GuideNext/GuideNext';
import * as browserStorage from '../../src/utils/browser-storage';

const renderGuideNext = (slug) => {
  return render(<GuideNext metadata={mockData.metadata} slug={slug} />);
};

describe('GuideNext', () => {
  jest.useFakeTimers();
  const mockedLocalStorage = {};
  let mockedSetLocalValue;

  beforeAll(() => {
    // Mock browser storage to make sure that this component is properly saving the values
    mockedSetLocalValue = jest
      .spyOn(browserStorage, 'setLocalValue')
      .mockImplementation((localStorageKey, readGuides) => {
        mockedLocalStorage[localStorageKey] = readGuides;
      });
  });

  afterAll(() => {
    mockedSetLocalValue.mockClear();
  });

  const checkLocalStorage = (slug) => {
    expect(mockedLocalStorage['readGuides'][slug]).toBeTruthy();
  };

  it('renders the next guide in the same chapter', () => {
    const currentSlug = 'cloud/account';
    const wrapper = renderGuideNext(currentSlug);
    expect(wrapper.asFragment()).toMatchSnapshot();
    checkLocalStorage(currentSlug);
  });

  it('renders the first guide in the next chapter', () => {
    const currentSlug = 'cloud/migrate-from-aws-to-atlas';
    const wrapper = renderGuideNext(currentSlug);
    expect(wrapper.asFragment()).toMatchSnapshot();
    checkLocalStorage(currentSlug);
  });

  it('renders the default copy on the final guide', () => {
    const currentSlug = 'server/read';
    const wrapper = renderGuideNext(currentSlug);
    expect(wrapper.asFragment()).toMatchSnapshot();
    checkLocalStorage(currentSlug);
  });

  // it('renders custom copy')
});
