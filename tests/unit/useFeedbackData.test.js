import React from 'react';
import * as Gatsby from 'gatsby';
import { mount } from 'enzyme';
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
      <div id="slug" value={feedbackData.slug} />
      <div id="url" value={feedbackData.url} />
      <div id="title" value={feedbackData.title} />
      <div id="docs_property" value={feedbackData.docs_property} />
      <div id="docs_version" value={feedbackData.docs_version} />
    </>
  );
};

describe('useFeedbackData', () => {
  it('returns information on the current project', () => {
    const wrapper = mount(
      <Test
        data={{
          slug: '/test',
          title: 'Test Page Please Ignore',
          url: 'https://docs.mongodb.com/test',
        }}
      />
    );

    expect(wrapper.find('#slug').prop('value')).toEqual('/test');
    expect(wrapper.find('#url').prop('value')).toEqual('https://docs.mongodb.com/test');
    expect(wrapper.find('#title').prop('value')).toEqual('Test Page Please Ignore');
    expect(wrapper.find('#docs_property').prop('value')).toEqual('testproject');
    expect(wrapper.find('#docs_version').prop('value')).toEqual(null);
  });

  it('returns the current docs version, if applicable', () => {
    const wrapper = mount(
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

    expect(wrapper.find('#slug').prop('value')).toEqual('/test');
    expect(wrapper.find('#url').prop('value')).toEqual('https://docs.mongodb.com/test');
    expect(wrapper.find('#title').prop('value')).toEqual('Test Page Please Ignore');
    expect(wrapper.find('#docs_property').prop('value')).toEqual('testproject');
    expect(wrapper.find('#docs_version').prop('value')).toEqual('4.2');
  });
});
