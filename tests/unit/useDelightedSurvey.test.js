import React from 'react';
import { jest } from '@jest/globals';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';
import { useDelightedSurvey } from '../../src/hooks/useDelightedSurvey';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');

const mockStaticQuery = (mockBranch, mockEnv) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        parserBranch: mockBranch,
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

const TestComponent = ({ project }) => {
  const slug = 'test';
  useDelightedSurvey(slug, project);
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
    mockStaticQuery(branch, 'production');
    render(<TestComponent project={project} />);
    expect(testSurveyObj).toEqual(expectedSurveyObj(branch, project));
  });

  it('succeeds in reporting a project name different from its snooty project', () => {
    const branch = 'test-different';
    mockStaticQuery(branch, 'production');
    render(<TestComponent project="cloud-docs" />);
    expect(testSurveyObj).toEqual(expectedSurveyObj(branch, 'atlas'));
  });

  it('fails to report a survey when not in production', () => {
    mockStaticQuery('test-not-production', 'staging');
    render(<TestComponent project="cloud-docs" />);
    expect(testSurveyObj).toEqual({});
  });

  it('fails to report a survey when project is not eligible', () => {
    mockStaticQuery('test-not-project', 'production');
    render(<TestComponent project="test-docs" />);
    expect(testSurveyObj).toEqual({});
  });
});
