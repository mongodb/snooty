import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ComponentFactory from '../../src/components/ComponentFactory';

describe('Chatbot Ui', () => {
  it('renders the chatbot through the ComponentFactor', async () => {
    const wrapper = render(<ComponentFactory nodeData={{ type: 'chatbot' }} />);
    await waitFor(() => expect(wrapper.getByTestId('chatbot-ui')).toBeInTheDocument());
  });
});
