import React from 'react';
import * as Gatsby from 'gatsby';
import { useDelightedSurvey } from '../../src/hooks/useDelightedSurvey';
import { mount } from 'enzyme';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');

const mockStaticQuery = (mockBranch, mockEnv, mockProject) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        parserBranch: mockBranch,
        project: mockProject,
        snootyEnv: mockEnv,
      },
    },
  }));
};

const expectedSurveyObj = (expectedBranch, expectedProject) => ({
  minTimeOnPage: 90,
  properties: {
    branch: expectedBranch,
    project: expectedProject,
  },
});

const TestComponent = () => {
  const slug = 'test';
  useDelightedSurvey(slug);
  return null;
};

describe('useDelightedSurvey()', () => {
  let testSurveyObj;
  window.delighted = {
    survey: jest.fn((surveyObj) => {
      testSurveyObj = surveyObj;
    }),
  };

  beforeEach(() => {
    testSurveyObj = {};
  });

  it('succeeds in showing a survey', () => {
    const branch = 'test';
    const project = 'node';
    mockStaticQuery(branch, 'production', project);
    mount(<TestComponent />);
    expect(testSurveyObj).toEqual(expectedSurveyObj(branch, project));
  });

  it('succeeds in reporting a project name different from its snooty project', () => {
    const branch = 'test-different';
    mockStaticQuery(branch, 'production', 'cloud-docs');
    mount(<TestComponent />);
    expect(testSurveyObj).toEqual(expectedSurveyObj(branch, 'atlas'));
  });

  it('fails to report a survey when not in production', () => {
    mockStaticQuery('test-not-production', 'staging', 'cloud-docs');
    mount(<TestComponent />);
    expect(testSurveyObj).toEqual({});
  });

  it('fails to report a survey when project is not eligible', () => {
    mockStaticQuery('test-not-project', 'production', 'test-docs');
    mount(<TestComponent />);
    expect(testSurveyObj).toEqual({});
  });
});
