import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../src/components/Button';

// data for this component
import mockData from './data/Button.test.json';
import Link from '../../src/components/Link';

jest.mock('../../src/components/Link');

describe('button component', () => {
  beforeEach(() => {
    Link.mockImplementation(jest.requireActual('../../src/components/Link').default);
  });

  it('renders correctly', () => {
    const tree = render(<Button nodeData={mockData} />);
    tree.debug();
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('converts to a link when passed an uri', () => {
    Link.mockImplementation(() => <div>this is a link</div>);
    const tree = render(<Button nodeData={mockData} />);
    expect(tree.getByText('this is a link')).toBeTruthy();
  });
});
