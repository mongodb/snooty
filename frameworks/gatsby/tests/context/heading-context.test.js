import { render } from '@testing-library/react';
import { HeadingContextProvider, useHeadingContext } from '../../src/context/heading-context';

const Consumer = ({ test_id }) => {
  const { lastHeading } = useHeadingContext();
  return <span data-testid={test_id}>{lastHeading}</span>;
};

describe('Heading Context', () => {
  it('initializes with an empty string', () => {
    const testId = 'check-headings';
    const wrapper = render(<Consumer test_id={testId} />);
    expect(wrapper.queryByTestId(testId).innerHTML).toBeFalsy();
  });

  it('is used by consumer to get all the preceding headings on the page', () => {
    const wrapper = render(
      <HeadingContextProvider heading={'Heading 1'}>
        <HeadingContextProvider heading={'Heading 1A'}>
          <HeadingContextProvider heading={'Heading 1Aa'}>
            <Consumer test_id={'consumer-1'} />
            <Consumer test_id={'consumer-2'} />
          </HeadingContextProvider>
        </HeadingContextProvider>
        <HeadingContextProvider heading={'Heading 1B'}>
          <Consumer test_id={'consumer-3'} />
        </HeadingContextProvider>
      </HeadingContextProvider>
    );

    expect(wrapper.queryByTestId('consumer-1').innerHTML).toEqual('Heading 1Aa');
    expect(wrapper.queryByTestId('consumer-2').innerHTML).toEqual('Heading 1Aa');
    expect(wrapper.queryByTestId('consumer-3').innerHTML).toEqual('Heading 1B');
  });

  it('can ignore the next heading if specified', () => {
    const wrapper = render(
      <HeadingContextProvider heading={'Heading 1'}>
        <HeadingContextProvider ignoreNextHeading={true}>
          <HeadingContextProvider heading={'Heading 2'}>
            <Consumer test_id={'ignore-prev-heading-1'} />
          </HeadingContextProvider>
        </HeadingContextProvider>
      </HeadingContextProvider>
    );

    expect(wrapper.queryByTestId('ignore-prev-heading-1').innerHTML).toEqual('Heading 1');
  });
});
