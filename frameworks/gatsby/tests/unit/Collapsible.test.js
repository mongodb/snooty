import React from 'react';
import { render, act } from '@testing-library/react';

import { mockLocation } from '../utils/mock-location';
import Collapsible from '../../src/components/Collapsible';
import mockData from './data/Collapsible.test.json';
import expandedMockData from './data/CollapsibleExpanded.test.json';

describe('collapsible component', () => {
  it('renders all the content in the options and children', () => {
    const renderResult = render(<Collapsible nodeData={mockData}></Collapsible>);
    expect(renderResult.asFragment()).toMatchSnapshot();
    expect(renderResult.getByText('This is a heading')).toBeTruthy();
    expect(renderResult.getByText('This is a subheading')).toBeTruthy();
    expect(renderResult.getByText('This is collapsible content')).toBeTruthy();
  });

  it('renders the content and correct icon when interacted', async () => {
    const renderResult = render(<Collapsible nodeData={mockData}></Collapsible>);
    let button = renderResult.getByRole('button');
    const collapsedContent = renderResult.getByText('This is collapsible content');

    let icon = button.querySelector('[role=img]');
    expect(icon.getAttribute('aria-label')).toContain('Chevron');
    expect(icon.getAttribute('aria-label')).toContain('Right');

    await act(async () => {
      button.click();
    });

    button = renderResult.getByRole('button');
    icon = button.querySelector('[role=img]');
    expect(icon.getAttribute('aria-label')).toContain('Chevron');
    expect(icon.getAttribute('aria-label')).toContain('Down');
    expect(collapsedContent).toBeVisible();
  });

  it('opens the collapsible content if hash is found in the URL', async () => {
    mockLocation(null, '/', '#this-is-a-heading');
    let renderResult = render(<Collapsible nodeData={mockData}></Collapsible>),
      button = renderResult.getByRole('button'),
      icon = button.querySelector('[role=img]');
    expect(icon.getAttribute('aria-label')).toContain('Chevron');
    expect(icon.getAttribute('aria-label')).toContain('Down');
  });

  it('is default expanded if expanded option is truthy', async () => {
    const renderResult = render(<Collapsible nodeData={expandedMockData} />),
      button = renderResult.getByRole('button'),
      icon = button.querySelector('[role=img]');
    expect(icon.getAttribute('aria-label')).toContain('Chevron');
    expect(icon.getAttribute('aria-label')).toContain('Down');
  });
});
