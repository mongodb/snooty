import React from 'react';
import useVisibleOnScroll from '../../src/hooks/useVisibleOnScroll';
import { mount } from 'enzyme';

const TestComponent = () => {
  const isVisible = useVisibleOnScroll('.sentinel');

  return (
    <>
      <div className="sentinel">Sentinel</div>
      <div className="result" data-result={isVisible} />
    </>
  );
};

// TODO: Mock the Intersection Observer API to be more reusable across different tests and components.
const mockIntsersectionRatio = (mockRatio) => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe() {
      this.callback([
        {
          intersectionRatio: mockRatio,
        },
      ]);
    }

    unobserve() {
      return null;
    }
  };
};

describe('useVisibleOnScroll', () => {
  // Get original value of IntersectionObserver to reset it later
  const originalIntersectionObserver = global.IntersectionObserver;
  jest.useFakeTimers();

  beforeAll(() => {
    jest.spyOn(document, 'querySelector').mockImplementation(() => {
      return {
        getBoundingClientRect: jest.fn().mockImplementation(() => {
          return {
            height: 900,
          };
        }),
      };
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('returns false when sentinel is in view', async () => {
    mockIntsersectionRatio(1);
    const wrapper = mount(<TestComponent />);
    const result = wrapper.find(`.result`);
    expect(result.prop('data-result')).toBeFalsy();
  });

  it('returns true when sentinel is out of view', () => {
    mockIntsersectionRatio(0);
    const wrapper = mount(<TestComponent />);
    const result = wrapper.find(`.result`);
    expect(result.prop('data-result')).toBeTruthy();
  });
});
