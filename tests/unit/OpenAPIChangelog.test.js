import React from 'react';
import { render } from '@testing-library/react';
import OpenAPIChangelog from '../../src/components/OpenAPIChangelog';

describe('OpenAPIChangelog tests', () => {
  it('OpenAPIChangelog renders correctly', () => {
    const tree = render(<OpenAPIChangelog />);
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
