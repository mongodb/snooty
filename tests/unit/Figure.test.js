import React from 'react';
import { render } from 'enzyme';
import Figure from '../../src/components/Figure';

// data for this component
import mockData from './data/Figure.test.json';
import borderData from './data/FigureBorder.test.json';
import lightboxData from './data/FigureLightbox.test.json';

it('renders correctly', () => {
  const tree = render(<Figure nodeData={mockData} />);
  expect(tree).toMatchSnapshot();
});

it('renders border correctly when specified as an option', () => {
  const tree = render(<Figure nodeData={borderData} />);
  expect(tree).toMatchSnapshot();
});

it('renders lightbox correctly when specified as an option', () => {
  const tree = render(<Figure nodeData={lightboxData} />);
  expect(tree).toMatchSnapshot();
});
