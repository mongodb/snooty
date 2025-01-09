import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Modal from '@leafygreen-ui/modal';
import { Body, H3, Link } from '@leafygreen-ui/typography';
import TextInput from '@leafygreen-ui/text-input';
import {
  Cell,
  flexRender,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
  TableBody,
  TableHead,
  useLeafyGreenTable,
  type HeaderGroup,
  type LGColumnDef,
  type LeafyGreenTableRow,
} from '@leafygreen-ui/table';
import { Select, Option } from '@leafygreen-ui/select';
import Box from '@leafygreen-ui/box';
import Button from '@leafygreen-ui/button';
import { theme } from '../../theme/docsTheme';
import fetchAndSaveFile from '../../utils/download-file';
import { useOfflineDownloadContext, type OfflineVersion, type OfflineRepo } from './DownloadContext';

const headingStyle = css`
  margin-bottom: ${theme.size.small};
`;
const bodyStyle = css`
  margin-bottom: ${theme.size.small};
`;
const searchInputStyle = css`
  margin-bottom: ${theme.size.small};
`;
const tableStyling = css`

`;

const footerStyling = css``;

type VersionSelectProps = { versions: OfflineVersion[]; onSelect: (e: string) => void };
const VersionSelect = ({ versions, onSelect }: VersionSelectProps) => {
  const [selected, setSelected] = useState(() => versions[0].url);
  useEffect(() => {
    onSelect(selected);
  }, [onSelect, selected]);
  return (
    <Select
      onChange={(e) => {
        setSelected(e);
      }}
      allowDeselect={false}
      aria-labelledby={'Select Offline Version'}
      value={selected}
    >
      {versions.map((version: OfflineVersion, i: number) => {
        return (
          <Option key={i} value={version.url}>
            {version.displayName}
          </Option>
        );
      })}
    </Select>
  );
};

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DownloadModal = ({ open, setOpen }: ModalProps) => {
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState({});
  const { repos } = useOfflineDownloadContext();
  const selectedVersions = useRef<Record<OfflineRepo['displayName'], OfflineVersion>>({});

  const data = useMemo(() => repos, [repos]);
  const columns = useMemo(() => {
    return [
      {
        header: 'Products',
        accessorKey: 'displayName',
      },
      {
        header: 'Versions',
        accessorKey: 'versions',
        cell: (cellContext) => {
          const versions: OfflineVersion[] = (cellContext.getValue() as OfflineVersion[]) ?? [];
          const repoDisplayName = cellContext.row.original.displayName;
          return (
            <VersionSelect
              versions={versions}
              onSelect={(e: string) => {
                const version = versions.find((version) => version.url === e);
                if (version) {
                  selectedVersions.current[repoDisplayName] = version;
                }
              }}
            />
          );
        },
      },
    ] as LGColumnDef<OfflineRepo>[];
  }, []);

  const table = useLeafyGreenTable({
    containerRef: tableRef,
    data: data,
    columns: columns,
    hasSelectableRows: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
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

    return Promise.all(
      urlsToRequest.map(async (urlData) => {
        // TODO: remove test code for using test data
        return fetchAndSaveFile('https://www.mongodb.com/docs/offline/bi-connector-v1.1.tar.gz', 'test.tar.gz');
        // return fetchAndSaveFile(urlData.url, `${urlData.repo}-${urlData.version}.tar.gz`);
      })
    );
  };

  return (
    <Modal size={'large'} open={open} setOpen={setOpen}>
      <H3 className={cx(headingStyle)}>Download Documentation</H3>

      <Body className={cx(bodyStyle)}>
        Navigate the table to find the product and version you wish to download. Looking for another product? Visit
        our&nbsp;
        <Link hideExternalIcon={false} href={'https://www.mongodb.com/docs/legacy/'}>
          legacy docs site
        </Link>
      </Body>

      <TextInput
        className={cx(searchInputStyle)}
        aria-labelledby={'Search for offline documentation'}
        onChange={(e) => {
          setSearchText(e.target.value);
          // TODO: filterResults
        }}
        value={searchText}
      ></TextInput>

      <Table table={table} ref={tableRef} className={cx(tableStyling)}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<OfflineRepo>) => (
            <HeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <HeaderCell key={header.id} header={header}>
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
              <Row key={row.id} row={row}>
                {row.getVisibleCells().map((cell) => {
                  return <Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Cell>;
                })}
              </Row>
            );
          })}
        </TableBody>
      </Table>

      <Box className={footerStyling}>
        <Button onClick={onDownload} />
      </Box>
    </Modal>
  );
};

export default DownloadModal;
