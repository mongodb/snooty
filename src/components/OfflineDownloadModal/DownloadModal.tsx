import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Modal from '@leafygreen-ui/modal';
import {
  Cell,
  flexRender,
  HeaderCell,
  HeaderRow,
  Row as LeafyRow,
  Table as LeafyTable,
  TableBody,
  TableHead,
  useLeafyGreenTable,
  getFilteredRowModel,
} from '@leafygreen-ui/table';
import type { HeaderGroup, LGColumnDef, LeafyGreenTableRow, CoreRow } from '@leafygreen-ui/table';
import TextInput from '@leafygreen-ui/text-input';
import { useToast, Variant } from '@leafygreen-ui/toast';
import { Body, H3, Link } from '@leafygreen-ui/typography';
import Box from '@leafygreen-ui/box';
import Button from '@leafygreen-ui/button';
import { theme } from '../../theme/docsTheme';
import fetchAndSaveFile from '../../utils/download-file';
import { useOfflineDownloadContext, type OfflineVersion, type OfflineRepo } from './DownloadContext';
import VersionSelect from './VersionSelector';

const modalStyle = css`
  [role='dialog'] {
    max-height: 520px;
    max-width: 690px;
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color-primary);
  }
`;
const headingStyle = css`
  margin-bottom: ${theme.size.small};
`;
const bodyStyle = css`
  margin-bottom: ${theme.size.small};
`;
const searchInputStyle = css`
  margin-bottom: ${theme.size.default};
  max-width: 260px;
`;
const tableStyling = css``;

const footerStyling = css`
  display: flex;
  margin-top: ${theme.size.large};
  column-gap: 8px;
  justify-content: flex-end;
`;

const cellStyling = css`
  padding: 10px 8px;
  overflow: visible;

  > div {
    height: 20px;
    min-height: unset;
  }
`;

const headerCellStyling = css`
  > * {
    justify-content: left;
    text-align: left;
  }
`;

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DownloadModal = ({ open, setOpen }: ModalProps) => {
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const { repos } = useOfflineDownloadContext();
  const selectedVersions = useRef<Record<OfflineRepo['displayName'], OfflineVersion>>({});
  const { pushToast } = useToast();

  useEffect(() => {
    // reset row selection when modal is opened/closed
    setRowSelection({});
  }, [open]);

  const columns = useMemo(() => {
    return [
      {
        header: 'Products',
        accessorKey: 'displayName',
        size: 420,
        enableGlobalFilter: true,
      },
      {
        header: 'Version',
        accessorKey: 'versions',
        cell: (cellContext) => {
          const versions = (cellContext.getValue() ?? []) as OfflineVersion[];
          const repoDisplayName = cellContext.row.original.displayName;
          if (versions?.length < 2) {
            selectedVersions.current[repoDisplayName] = versions[0];
            return;
          }
          return (
            <VersionSelect
              offlineRepo={cellContext.row.original}
              versions={versions}
              onSelect={(index: number) => {
                const version = versions[index];
                if (version) {
                  selectedVersions.current[repoDisplayName] = version;
                }
              }}
            />
          );
        },
        size: 140,
        align: 'right',
        enableGlobalFilter: true,
      },
    ] as LGColumnDef<OfflineRepo>[];
  }, []);

  const filter = useCallback((row: CoreRow<OfflineRepo>, _columnId: string, filterValue: string) => {
    const searchText = filterValue.toLowerCase();
    const offlineRepo = row.original;
    return (
      offlineRepo.displayName.toLowerCase().includes(searchText) ||
      offlineRepo.versions
        .reduce((res, version) => {
          return res + ' ' + version.displayName;
        }, '')
        ?.includes(searchText)
    );
  }, []);

  const table = useLeafyGreenTable({
    containerRef: tableRef,
    data: repos,
    columns: columns,
    hasSelectableRows: true,
    state: {
      rowSelection,
      globalFilter: searchText,
    },
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filter,
    onGlobalFilterChange: setSearchText,
  });
  const { rows } = table.getRowModel();

  const onDownload = async () => {
    const selectedDisplayNames = table.getSelectedRowModel().flatRows.map((row) => row.original.displayName);
    const urlsToRequest: { repo: string; version: string; url: string }[] = [];
    for (const displayName of selectedDisplayNames) {
      urlsToRequest.push({
        repo: displayName,
        version: selectedVersions.current[displayName].displayName,
        url: selectedVersions.current[displayName].url,
      });
    }
    await Promise.all(
      urlsToRequest.map(async (urlData) => {
        try {
          await fetchAndSaveFile(urlData.url, `${urlData.repo}-${urlData.version}.tar.gz`);
          pushToast({
            title: 'Download Initiated',
            description: urlData.repo,
            variant: Variant.Success,
            dismissible: true,
          });
        } catch (e) {
          pushToast({
            title: 'Download Failed',
            description: urlData.repo,
            variant: Variant.Warning,
            dismissible: true,
          });
        }
      })
    );
    setOpen(false);
  };

  return (
    <Modal onClick={(e) => e.stopPropagation()} className={cx(modalStyle)} size={'large'} open={open} setOpen={setOpen}>
      <H3 className={cx(headingStyle)}>Download Documentation</H3>

      <Body className={cx(bodyStyle)}>
        Navigate the table to find the product and version you wish to download. Looking for another product? Visit
        our&nbsp;
        <Link hideExternalIcon={false} href={'https://mongodb.com/docs/legacy/'}>
          legacy docs site
        </Link>
      </Body>

      <TextInput
        className={cx(searchInputStyle)}
        // TODO: can remove aria-labelledby after upgrading LG/TextInput
        aria-labelledby={'null'}
        aria-label={'Search for Offline Documentation'}
        onChange={(e) => {
          table.setGlobalFilter(String(e.target.value));
        }}
        placeholder={'Search products'}
        value={searchText}
      ></TextInput>

      <LeafyTable shouldAlternateRowColor={true} table={table} ref={tableRef} className={cx(tableStyling)}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<OfflineRepo>) => (
            <HeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <HeaderCell className={cx(headerCellStyling)} key={header.id} header={header}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </HeaderCell>
                );
              })}
            </HeaderRow>
          ))}
        </TableHead>

        <TableBody>
          {rows.map((row: LeafyGreenTableRow<OfflineRepo>) => {
            return (
              <LeafyRow key={row.id} row={row}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Cell className={cx(cellStyling)} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Cell>
                  );
                })}
              </LeafyRow>
            );
          })}
        </TableBody>
      </LeafyTable>

      <Box className={footerStyling}>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button disabled={!rowSelection || !Object.keys(rowSelection)?.length} onClick={onDownload}>
          Download
        </Button>
      </Box>
    </Modal>
  );
};

export default DownloadModal;
