import React from 'react';
import { shallow } from 'enzyme';
import VersionModified from '../../src/components/VersionModified';

// data for this component
import { deprecated, versionadded, versionchanged } from './data/VersionModified.test.json';

const shallowRender = data => shallow(<VersionModified nodeData={data} />);

describe('when rendering a deprecated directive with 0 arguments', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowRender(deprecated);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('when rendering a versionadded directive with one argument', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowRender(versionadded);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('when rendering a versionchanged directive with two arguments', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowRender(versionchanged);
    expect(wrapper).toMatchSnapshot();
  });
});
