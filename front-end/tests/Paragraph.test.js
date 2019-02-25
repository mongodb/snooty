import React from 'react';
import { shallow } from 'enzyme';
import Paragraph from '../src/components/Paragraph';

it('renders correctly', () => {
  const tree = shallow(<Paragraph nodeData={{ children: [{ type: 'text', value: 'hello world' }] }} />);
  expect(tree).toMatchSnapshot();
});
