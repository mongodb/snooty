import React from 'react';

import * as Gatsby from 'gatsby';

import { render, waitFor, fireEvent } from '@testing-library/react';
import { DownloadButton } from '../../src/components/OfflineDownloadModal';
import { OfflineDownloadProvider } from '../../src/components/OfflineDownloadModal/DownloadContext';
import * as SnootyDataApi from '../../src/utils/snooty-data-api';
import { setMatchMedia } from '../utils';

const mockGetAllRepos = jest.spyOn(SnootyDataApi, 'getAllRepos');
const mockDataApi = () => {
  mockGetAllRepos.mockResolvedValue([] as SnootyDataApi.Repo[]);
};

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const mockStaticQuery = () => {
  useStaticQuery.mockImplementation(() => ({
    allDocset: { nodes: [] },
  }));
};

describe('Offline download button', () => {
  beforeAll(() => {
    mockDataApi();
    setMatchMedia();
    mockStaticQuery();
  });

  it('opens the offline modal when clicked', async () => {
    const renderRes = render(
      <OfflineDownloadProvider>
        <DownloadButton />
      </OfflineDownloadProvider>
    );
    const button = renderRes.container.querySelector('button');
    fireEvent.click(button as HTMLButtonElement);
    await waitFor(() => {
      expect(renderRes.getByRole('dialog')).toBeTruthy();
    });

    expect(renderRes.baseElement).toMatchSnapshot();
  });
});
