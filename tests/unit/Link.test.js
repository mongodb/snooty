import React from 'react';
import { render } from '@testing-library/react';
import Link from '../../src/components/Link';

const setup = ({ text, ...rest }) => render(<Link {...rest}>{text}</Link>);

describe('Link component renders a variety of strings correctly', () => {
  it('empty string', () => {
    const tree = setup({ to: '', text: 'Empty string' });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('external URL', () => {
    const tree = setup({ to: 'http://mongodb.com', text: 'MongoDB Company' });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('internal link', () => {
    const tree = setup({ to: 'drivers/c', text: 'C Driver', className: 'test-class' });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('internal link with hash', () => {
    const tree = setup({ to: 'drivers/pymongo#installation', text: 'C Driver', className: 'test-class' });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('internal link query param', () => {
    const tree = setup({ to: 'drivers/ruby?site=drivers', text: 'C Driver', className: 'test-class' });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('internal link that already includes trailing slash', () => {
    const tree = setup({ to: 'drivers/nodejs/#installation', text: 'C Driver', className: 'test-class' });
    expect(tree.asFragment()).toMatchSnapshot();
  });

  it('identfies mailto links as external urls', () => {
    const tree = setup({ to: 'mailto:docs@mongodb.com', text: 'docs@mongodb.com' });
    expect(tree.asFragment()).toMatchSnapshot();
  });
});
