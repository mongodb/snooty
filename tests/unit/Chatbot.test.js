import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as snootyMetadata from '../../src/utils/use-snooty-metadata';
import ActionBar from '../../src/components/ActionBar/ActionBar';

jest.mock('../../src/hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({ reposDatabase: 'pool_test' }),
}));
jest.spyOn(snootyMetadata, 'default').mockImplementation(() => ({
  branch: 'master',
  project: '',
}));

describe('Chatbot Ui', () => {
  it('renders the chatbot through the ActionBar Component', async () => {
    const wrapper = render(<ActionBar />);
    await waitFor(() => expect(wrapper.getByTestId('chatbot-ui')).toBeInTheDocument());
  });
});
