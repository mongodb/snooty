import React, { forwardRef, RefObject, useEffect, useRef, useState, type ForwardedRef } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { Select, Option } from '@leafygreen-ui/select';
import { theme } from '../../theme/docsTheme';
import { type OfflineVersion, type OfflineRepo } from './DownloadContext';

const selectStyling = css`
  min-width: 94px;
  width: 100%;
  height: ${theme.size.medium};
  > * {
    font-size: ${theme.fontSize.small} !important;
  }

  + div {
    z-index: 9;
  }
`;

const portalStyling = css`
  position: relative;
  display: flex;
  width: 100%;
`;

const optionStyling = css`
  line-height: ${theme.fontSize.small};
  font-size: ${theme.fontSize.small};

  > *:nth-child(1) {
    display: none;
  }
`;

const PortalContainer = forwardRef(
  (
    { className, children }: { className?: string; children: JSX.Element[] | JSX.Element },
    forwardRef: ForwardedRef<HTMLDivElement | null>
  ) => (
    <div className={cx('this-the-portal', portalStyling, className)} ref={forwardRef}>
      {children}
    </div>
  )
);

type VersionSelectProps = {
  offlineRepo: OfflineRepo;
  versions: OfflineVersion[];
  onSelect: (e: number) => void;
  tableRef: RefObject<HTMLDivElement>;
};

const VersionSelect = ({ offlineRepo, versions, onSelect, tableRef }: VersionSelectProps) => {
  const [selected, setSelected] = useState(() => 0);
  const portalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    onSelect(selected);
  }, [onSelect, selected]);


  useEffect(() => {
    const scrollFn = () => {
      // WANT TO SET CLOSE HERE
      tableRef.current?.click();
    }
    const currentRef = tableRef.current;
    currentRef?.addEventListener('scroll',scrollFn);

    return () => {
      currentRef?.removeEventListener('scroll', scrollFn);
    }
  }, [tableRef]);

  return (
    <PortalContainer ref={portalRef}>
      <Select
        baseFontSize={13}
        onChange={(e) => {
          setSelected(parseInt(e, 10));
        }}
        className={cx(selectStyling)}
        allowDeselect={false}
        // TODO: can remove aria-labelledby after upgrading LG/Select
        // https://github.com/mongodb/leafygreen-ui/blob/%40leafygreen-ui/select%407.0.1/packages/select/src/Select.tsx#L105
        aria-labelledby={'null'}
        aria-label={`Select Offline Version for ${offlineRepo.displayName}`}
        value={selected.toString()}
        disabled={versions.length < 2}
      >
        {versions.map((version: OfflineVersion, i: number) => {
          return (
            <Option className={optionStyling} key={i} value={i.toString()}>
              {version.displayName}
            </Option>
          );
        })}
      </Select>
    </PortalContainer>
  );
};

export default VersionSelect;
