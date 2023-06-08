import React from 'react';
import { render, screen } from '@testing-library/react';
import { getNestedValue } from '../../src/utils/get-nested-value';
import { grabMetaFromDirective } from '../../src/utils/get-meta-from-directive';
import Meta from '../../src/components/Meta';

// data for this component
import { metaTestData } from './data/MetaData';

describe('Meta Tag', () => {
  console.log('this is a test suit');
  it('does not renders a Meta correctly when the meta value is present', () => {
    const c = {
      options: {},
    };
    const wrapper = render(<Meta nodeData={c} />);
    expect(wrapper.queryByTestId('directive-meta')).not.toBeInTheDocument();
  });

  it('renders meta tags correctly when meta data is presented', () => {
    const section = metaTestData.find((node) => node.type === 'section');
    const sectionNodes = getNestedValue(['children'], section);
    const meta = grabMetaFromDirective(sectionNodes, 'meta');

    meta.forEach((c) => {
      render(<Meta nodeData={c} />);
    });

    expect(screen.getAllByTestId('directive-meta')).toHaveLength(2);
  });
});
