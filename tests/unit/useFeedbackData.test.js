import React from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import useFeedbackData from '../../src/components/Widgets/FeedbackWidget/useFeedbackData';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      parserBranch: 'testbranch',
      project: 'testproject',
      snootyBranch: 'test',
      user: 'testuser',
    },
  },
}));

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
    expect(wrapper.queryByText('4.2')).toEqual(null);
  });

  it('returns the current docs version, if applicable', () => {
    const wrapper = render(
      <Test
        data={{
          slug: '/test',
          title: 'Test Page Please Ignore',
          url: 'https://docs.mongodb.com/test',
          publishedBranches: {
            version: {
              published: '4.2',
            },
          },
        }}
      />
    );
    expect(wrapper.getByText('4.2')).toBeTruthy();
  });
});
