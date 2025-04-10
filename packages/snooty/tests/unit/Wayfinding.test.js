import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MAX_INIT_OPTIONS, Wayfinding } from '../../src/components/Wayfinding';
import mockData from './data/Wayfinding.test.json';

describe('Wayfinding component', () => {
  it('renders all options with description', () => {
    const res = render(<Wayfinding nodeData={mockData} />);
    const expectedTotalOptions = 18;

    expect(res.asFragment()).toMatchSnapshot();
    expect(res.getByText('MongoDB with drivers')).toBeTruthy();
    expect(
      res.getByText(
        'This page documents a mongosh method. To view the equivalent method in a MongoDB driver, visit the drivers page for your programming language'
      )
    ).toBeTruthy();

    expect(res.queryAllByRole('link', { hidden: false })).toHaveLength(MAX_INIT_OPTIONS);
    expect(res.queryAllByRole('link', { hidden: true })).toHaveLength(expectedTotalOptions);
    expect(res.queryByText('Show All', { exact: false })).toBeTruthy();
  });

  it('renders max initial options only', () => {
    const modifiedData = { ...mockData };
    // Add 1 to take into account description
    modifiedData.children = modifiedData.children.slice(0, MAX_INIT_OPTIONS + 1);
    const res = render(<Wayfinding nodeData={modifiedData} />);

    expect(res.queryAllByRole('link', { hidden: false })).toHaveLength(MAX_INIT_OPTIONS);
    expect(res.queryAllByRole('link', { hidden: true })).toHaveLength(MAX_INIT_OPTIONS);
    expect(res.queryByText('Show All', { exact: false })).toBeFalsy();
  });

  it('shows all options after interaction', () => {
    const res = render(<Wayfinding nodeData={mockData} />);
    const expectedTotalOptions = 18;

    expect(res.queryAllByRole('link', { hidden: false })).toHaveLength(MAX_INIT_OPTIONS);
    expect(res.queryAllByRole('link', { hidden: true })).toHaveLength(expectedTotalOptions);
    expect(res.queryByText('Show All', { exact: false })).toBeTruthy();

    const button = res.getByText('Show All', { exact: false }).closest('button');
    userEvent.click(button);

    expect(res.queryAllByRole('link', { hidden: false })).toHaveLength(expectedTotalOptions);
    expect(res.queryAllByRole('link', { hidden: true })).toHaveLength(expectedTotalOptions);
    expect(res.queryByText('Show All', { exact: false })).toBeFalsy();
    expect(res.queryByText('Collapse', { exact: false })).toBeTruthy();
  });
});
