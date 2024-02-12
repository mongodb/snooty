import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import useFeedbackData from '../../src/components/Widgets/FeedbackWidget/useFeedbackData';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      parserBranch: 'testbranch',
      snootyBranch: 'test',
      user: 'testuser',
    },
  },
}));

jest.mock(`../../src/utils/use-snooty-metadata`, () => {
  return () => ({
    project: 'testproject',
  });
});

const Test = (props) => {
  const feedbackData = useFeedbackData(props.data);
  return (
    <>
      <div id="slug"> {feedbackData.slug} </div>
      <div id="url"> {feedbackData.url} </div>
      <div id="title">{feedbackData.title} </div>
      <div id="docs_property"> {feedbackData.docs_property} </div>
      <div id="docs_version"> {feedbackData.docs_version} </div>
    </>
  );
};

describe('useFeedbackData', () => {
  it('returns information on the current project', () => {
    const wrapper = render(
      <Test
        data={{
          slug: '/test',
          title: 'Test Page Please Ignore',
          url: 'https://docs.mongodb.com/test',
        }}
      />
    );

    expect(wrapper.getByText('/test')).toBeTruthy();
    expect(wrapper.getByText('https://docs.mongodb.com/test')).toBeTruthy();
    expect(wrapper.getByText('Test Page Please Ignore')).toBeTruthy();
    expect(wrapper.getByText('testproject')).toBeTruthy();
  });
});
