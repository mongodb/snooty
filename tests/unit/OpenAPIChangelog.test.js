import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OpenAPIChangelog from '../../src/components/OpenAPIChangelog';
import { mockChangelog, mockDiff } from './data/OpenAPIChangelog';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({
    commitHash: '',
    parserBranch: '',
    patchId: '',
    pathPrefix: '',
    project: '',
    snootyBranch: '',
    user: '',
  }),
}));

describe('OpenAPI Changelog', () => {
  it('renders changelog correctly', () => {
    const component = render(<OpenAPIChangelog changelog={mockChangelog} diff={mockDiff} />);
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('renders diff correctly', async () => {
    const component = render(<OpenAPIChangelog changelog={mockChangelog} diff={mockDiff} />);

    let listitems = component.getAllByRole('listitem');
    expect(listitems.length).toBe(9);

    const diffRadioButton = component.getByLabelText(/Compare Two Versions/);
    userEvent.click(diffRadioButton);

    listitems = component.getAllByRole('listitem');
    expect(listitems.length).toBe(3);

    expect(component.asFragment()).toMatchSnapshot();
  });
});
