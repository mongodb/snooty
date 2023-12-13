import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ComponentFactory from '../../../src/components/ComponentFactory';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));

describe('Chatbot Ui', () => {
  it('renders the chatbot through the ComponentFactor', async () => {
    const wrapper = render(<ComponentFactory nodeData={{ type: 'chatbot' }} />);
    await waitFor(() => expect(wrapper.getByTestId('chatbot-ui')).toBeInTheDocument());
  });
});
