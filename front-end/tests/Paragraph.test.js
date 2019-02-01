import React from 'react';
import renderer from 'react-test-renderer';
import Paragraph from '../src/components/Paragraph';

it('renders correctly', () => {
  const tree = renderer
    .create(<Paragraph nodeData={ { 'children': [{ type: 'text', value: 'hello world' }] } } />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});