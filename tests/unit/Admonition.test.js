import React from 'react';
import { shallow } from 'enzyme';
import Admonition from '../../src/components/Admonition';

// data for this component
import mockDataAdm from './data/Admonition-adm.test.json';
import mockData from './data/Admonition.test.json';

it('admonitions render correctly', () => {
  const tree = shallow(<Admonition nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});

it('admonition one-off (name=admonition) renders correctly', () => {
  const tree = shallow(<Admonition nodeData={mockDataAdm} />);
  expect(tree).toMatchSnapshot();
});
