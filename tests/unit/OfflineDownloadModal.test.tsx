import React from 'react';

import { render, waitFor, fireEvent } from '@testing-library/react';
import { DownloadButton } from '../../src/components/OfflineDownloadModal';
import * as SnootyDataApi from '../../src/utils/snooty-data-api';
import { setMatchMedia } from '../utils';

const mockGetAllRepos = jest.spyOn(SnootyDataApi, 'getAllRepos');
const mockDataApi = () => {
  mockGetAllRepos.mockResolvedValue([] as SnootyDataApi.Repo[]);
};

describe('Offline download button', () => {
  beforeAll(() => {
    mockDataApi();
    setMatchMedia();
  });

  it('opens the offline modal when clicked', async () => {
    const renderRes = render(<DownloadButton />);
    const button = renderRes.container.querySelector('button');
    fireEvent.click(button as HTMLButtonElement);
    await waitFor(() => {
      expect(renderRes.getByRole('dialog')).toBeTruthy();
    });
    await waitFor(() => {
      return expect(renderRes.findByRole('row')).toBeTruthy()
    }, );
    renderRes.debug();

    expect(renderRes.baseElement).toMatchSnapshot();
  });
});
