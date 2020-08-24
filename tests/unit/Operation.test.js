import React from 'react';
import { mount, shallow } from 'enzyme';
import Operation from '../../src/components/Operation';

// data for this component
import { onlyDescription, neitherSummaryNorDescription, bothSummaryAndDescription } from './data/Operation.test.json';

const shallowOperation = data => shallow(<Operation nodeData={data} />);
const mountOperation = data => mount(<Operation nodeData={data} />);

describe('when rendering all fields', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowOperation(bothSummaryAndDescription);
    expect(wrapper).toMatchSnapshot();
  });

  it('expands when the button is clicked', () => {
    wrapper = mountOperation(bothSummaryAndDescription);
    // Use number of Component Factories as rough heuristic for amount of content being rendered
    const collapsed = wrapper.find('ComponentFactory');
    const button = wrapper.find('button');
    button.simulate('click');
    const expanded = wrapper.find('ComponentFactory');
    expect(expanded.length).toBeGreaterThan(collapsed.length);
  });
});

describe('when no summary is present', () => {
  let wrapper;

  it('renders correctly ', () => {
    wrapper = shallowOperation(onlyDescription);
    expect(wrapper).toMatchSnapshot();
  });

  it('does not show the "Description" heading', () => {
    wrapper = mountOperation(onlyDescription);
    expect(wrapper.text()).not.toContain('Description');
  });
});

describe('when no summary or description is present', () => {
  it('renders correctly ', () => {
    let wrapper = shallowOperation(neitherSummaryNorDescription);
    expect(wrapper).toMatchSnapshot();
  });
});
