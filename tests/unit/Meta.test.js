import React from 'react';
import { render, screen } from '@testing-library/react';
import { getMetaFromDirective } from '../../src/utils/get-meta-from-directive';
import Meta from '../../src/components/Meta';

// data for this component
import { testPageNodes } from './data/MetaData';

describe('Meta Tag', () => {
  it('does not renders a Meta correctly when the meta value is present', () => {
    const c = {
      options: {},
    };
    const wrapper = render(<Meta nodeData={c} />);
    expect(wrapper.queryByTestId('directive-meta')).not.toBeInTheDocument();
  });

  it('renders meta tags correctly when meta data is presented', () => {
    const meta = getMetaFromDirective('section', testPageNodes, 'meta');

    meta.forEach((c) => {
      render(<Meta nodeData={c} />);
    });

    expect(screen.getAllByTestId('directive-meta')).toHaveLength(2);
  });
});
