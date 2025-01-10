import React, { ForwardedRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Modal from '@leafygreen-ui/modal';
import { Body, H3, Link } from '@leafygreen-ui/typography';
// import TextInput from '@leafygreen-ui/text-input';
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

const modalStyle = css`
  [role='dialog'] {
    max-height: 520px;
    max-width: 690px;
    padding: 40px 36px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  }
`;
const headingStyle = css`
  margin-bottom: ${theme.size.small};
`;
const bodyStyle = css`
  margin-bottom: ${theme.size.small};
`;
// TODO: search input
// const searchInputStyle = css`
//   margin-bottom: ${theme.size.small};
// `;
const tableStyling = css``;

const footerStyling = css`
  display: flex;
  margin-top: ${theme.size.xlarge};
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

// TODO: separate file for version select
const selectStyling = css`
  max-width: 80%;
  min-width: 90px;
  height: ${theme.size.medium};

  + div {
    z-index: 9;
  }
`;

const portalStyling = css`
  position: relative;
  display: flex;
  justify-content: flex-end;
`;

const optionStyling = css`
  line-height: ${theme.fontSize.small};

  > *:nth-child(1) {
    display: none;
  }
`;

const PortalContainer = forwardRef(
  (
    { className, children }: { className?: string; children: JSX.Element[] | JSX.Element },
    forwardRef: ForwardedRef<HTMLDivElement | null>
  ) => (
    <div className={cx(portalStyling, className)} ref={forwardRef}>
      {children}
    </div>
  )
);

type VersionSelectProps = { versions: OfflineVersion[]; onSelect: (e: string) => void };
const VersionSelect = ({ versions, onSelect }: VersionSelectProps) => {
  const [selected, setSelected] = useState(() => versions[0].url);
  const portalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    onSelect(selected);
  }, [onSelect, selected]);
  return (
    <PortalContainer ref={portalRef}>
      <Select
        onChange={(e) => {
          setSelected(e);
        }}
        portalContainer={portalRef.current}
        scrollContainer={portalRef.current}
        className={cx(selectStyling)}
        allowDeselect={false}
        aria-labelledby={'Select Offline Version'}
        value={selected}
        disabled={versions.length < 2}
      >
        {versions.map((version: OfflineVersion, i: number) => {
          return (
            <Option className={optionStyling} key={i} value={version.url}>
              {version.displayName}
            </Option>
          );
        })}
      </Select>
    </PortalContainer>
  );
};

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DownloadModal = ({ open, setOpen }: ModalProps) => {
  // const [searchText, setSearchText] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState({});
  const { repos } = useOfflineDownloadContext();
  const selectedVersions = useRef<Record<OfflineRepo['displayName'], OfflineVersion>>({});

  useEffect(() => {
    // reset row selection when modal is opened/closed
    setRowSelection({});
  }, [open]);

  const data = useMemo(() => repos, [repos]);
  const columns = useMemo(() => {
    return [
      {
        header: 'Products',
        accessorKey: 'displayName',
        size: 420,
      },
      {
        header: 'Version',
        accessorKey: 'versions',
        cell: (cellContext) => {
          const versions = (cellContext.getValue() ?? []) as OfflineVersion[];
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
        size: 140,
        align: 'right',
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
        return fetchAndSaveFile(urlData.url, `${urlData.repo}.tar.gz`);
      })
    );
  };

  return (
    <Modal className={cx(modalStyle)} size={'large'} open={open} setOpen={setOpen}>
      <H3 className={cx(headingStyle)}>Download Documentation</H3>

      <Body className={cx(bodyStyle)}>
        Navigate the table to find the product and version you wish to download. Looking for another product? Visit
        our&nbsp;
        <Link hideExternalIcon={false} href={'https://mongodb.com/docs/legacy/'}>
          legacy docs site
        </Link>
      </Body>

      {/* <TextInput
        className={cx(searchInputStyle)}
        aria-labelledby={'Search for offline documentation'}
        onChange={(e) => {
          setSearchText(e.target.value);
          // TODO: filterResults
        }}
        value={searchText}
      ></TextInput> */}

      <Table table={table} ref={tableRef} className={cx(tableStyling)}>
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
              <Row key={row.id} row={row}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Cell className={cx(cellStyling)} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
        </TableBody>
      </Table>

      <Box className={footerStyling}>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button disabled={!rowSelection || !Object.keys(rowSelection)?.length} onClick={onDownload}>Download</Button>
      </Box>
    </Modal>
  );
};

export default DownloadModal;
