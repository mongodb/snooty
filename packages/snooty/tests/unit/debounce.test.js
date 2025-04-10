import debounce from '../../src/utils/debounce';

describe('debounce', () => {
  jest.useFakeTimers();
  it('only calls the wrapped function once when called multiple times in the debounce interval', async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    // Call the debounced function several times in a row
    // This all occurs well within the 200ms debounce interval
    debounced();
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(0);

    debounced();
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(0);

    debounced();
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(0);

    // Let the debounce interval expire
    jest.runAllTimers();

    expect(fn).toBeCalledTimes(1);
  });

  it('resets the debounce interval if called again within the interval', async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    // First call
    debounced();
    jest.advanceTimersByTime(100);

    // Second Call
    debounced();
    jest.advanceTimersByTime(100);

    // It's been 200ms since the first call, but the second call reset the interval
    expect(fn).toBeCalledTimes(0);

    // Wait until 200ms after the second call
    jest.advanceTimersByTime(100);

    // The interval expired so we called the wrapped function
    expect(fn).toBeCalledTimes(1);
  });
});
