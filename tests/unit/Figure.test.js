import React from 'react';
import { shallow } from 'enzyme';
import Figure from '../../src/components/Figure';

// data for this component
import mockData from './data/Figure.test.json';
import lightboxData from './data/FigureLightbox.test.json';

jest.mock('../../src/utils/get-path-prefix');

it('renders correctly', () => {
  const tree = shallow(<Figure nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});

it('renders lightbox correctly when specified as an option', () => {
  const tree = shallow(<Figure nodeData={lightboxData} />);
  expect(tree).toMatchSnapshot();
});
