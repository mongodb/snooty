import React from 'react';
import { shallow } from 'enzyme';
import Widgets from '../../src/components/Widgets/Widgets';

describe('Widgets', () => {
  let wrapper;
  const props = {
    guideName: 'server/auth',
    project: 'guides',
  };

  beforeAll(() => {
    wrapper = shallow(<Widgets {...props} />);
  });

  it('has one Deluge child', () => {
    expect(wrapper.find('Deluge')).toHaveLength(1);
  });

  it('does not have a Suggestion child', () => {
    expect(wrapper.find('Suggestion')).toHaveLength(0);
  });
});
