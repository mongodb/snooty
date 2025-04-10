import React from 'react';
import { render } from '@testing-library/react';
import VersionModified from '../../src/components/VersionModified';

// data for this component
import { deprecated, versionadded, versionchanged } from './data/VersionModified.test.json';

const shallowRender = (data) => render(<VersionModified nodeData={data} />);

describe('when rendering a deprecated directive with 0 arguments', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowRender(deprecated);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});

describe('when rendering a versionadded directive with one argument', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowRender(versionadded);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});

describe('when rendering a versionchanged directive with two arguments', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowRender(versionchanged);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
