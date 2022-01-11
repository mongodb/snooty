import React from 'react';
import { render } from '@testing-library/react';
import InternalPageNav from '../../src/components/InternalPageNav';
import slugTitleMapping from './data/ecosystem/slugTitleMapping.json';

const data = ['drivers/csharp', 'drivers/go', 'drivers/java'];

const renderNav = (slug) =>
  render(<InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={data} />);

it('renders a page with next and previous links correctly', () => {
  const tree = renderNav('drivers/go');
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders a page with no previous link correctly', () => {
  const tree = renderNav('drivers/csharp');
  expect(tree.asFragment()).toMatchSnapshot();
});

it('renders a page with no next link correctly', () => {
  const tree = renderNav('drivers/java');
  expect(tree.asFragment()).toMatchSnapshot();
});
