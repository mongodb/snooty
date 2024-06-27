import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ActionBar from '../../src/components/ActionBar/ActionBar';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));

describe('Chatbot Ui', () => {
  it('renders the chatbot through the ActionBar Component', async () => {
    const wrapper = render(<ActionBar />);
    await waitFor(() => expect(wrapper.getByTestId('chatbot-ui')).toBeInTheDocument());
  });
});
