import React from 'react';
import { mount } from 'enzyme';
import Heading from '../../src/components/Heading';
import { FeedbackProvider } from '../../src/components/Widgets/FeedbackWidget';
import { tick, withScreenSize } from '../utils';

// data for this component
import mockData from './data/Heading.test.json';

const mountHeadingWithFeedbackState = async (feedbackState = {}, options = {}) => {
  const { view, isSupportRequest, hideHeader = false, ...feedback } = feedbackState;
  const wrapper = mount(
    <FeedbackProvider
      test={{
        view,
        isSupportRequest,
        feedback: Object.keys(feedback).length ? feedback : null,
      }}
      page={{
        title: 'Test Page Please Ignore',
        slug: '/test',
        url: 'https://docs.mongodb.com/test',
        docs_property: 'test',
      }}
      hideHeader={hideHeader}
    >
      <Heading nodeData={mockData} sectionDepth={3} />
    </FeedbackProvider>,
    options
  );
  // Need to wait for the next tick to let Loadable components load
  await tick({ wrapper });
  return wrapper;
};

describe('Heading', () => {
  jest.useFakeTimers();
  let wrapper;

  it('renders correctly', async () => {
    wrapper = await mountHeadingWithFeedbackState({}, withScreenSize('desktop'));
    expect(wrapper).toMatchSnapshot();
  });

  describe('FeedbackHeader', () => {
    it('is shown on small/mobile screens', async () => {
      wrapper = await mountHeadingWithFeedbackState({}, withScreenSize('iphone-x'));
      expect(wrapper.exists('FeedbackHeading')).toBe(true);
    });

    it('is hidden on small/mobile screens when context specifies', async () => {
      wrapper = await mountHeadingWithFeedbackState({ hideHeader: true }, withScreenSize('iphone-x'));
      expect(wrapper.find('FeedbackHeading').prop('isVisible')).toBe(false);
    });

    it('is hidden on large/desktop screens', async () => {
      wrapper = await mountHeadingWithFeedbackState({}, withScreenSize('desktop'));
      expect(wrapper.find('FeedbackHeading').prop('isVisible')).toBe(false);
    });
  });
});
