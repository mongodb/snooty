import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from '../Link';
import { DATA_TOC_NODE } from '../../constants';
import { theme } from '../../theme/docsTheme';
import { getSuitableIcon } from '../../utils/get-suitable-icon';
import { IALinkedData as IALinkedDataType } from '../../types/data';

const ulStyling = css`
  display: grid;
  column-gap: 8px;
  row-gap: 4px;
  grid-template-columns: 1fr 1fr;
  list-style-type: none;
  padding-inline-start: 0px;
  padding: 8px;
`;

const liStyling = css`
  border-radius: 20px;
  font-size: ${theme.fontSize.small};
  max-width: 120px;
  height: 32px;

  :focus {
    border: 1px solid ${palette.blue.light1};

    // Override SideNavItem's ::before pseudo-element
    :focus:before {
      display: none;
    }

    // Custom recreation of LG Link's underlining, but spanning only the width
    // of the headline, rather than the whole link element.
    & > span > span {
      position: relative;

      ::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 4px;
        left: 0;
        border-radius: 2px;
        background-color: ${palette.blue.light1};
      }
    }
  }

  // Override LG's span for alignment
  & > span {
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: none;

    // Remove LG Link's existing underline pseudo-element
    :after {
      display: none;
    }
  }
`;

export type IALinkedDataProps = {
  linkedData: IALinkedDataType[];
};

const IALinkedData = ({ linkedData }: IALinkedDataProps) => {
  const { darkMode } = useDarkMode();
  return (
    <ul className={cx(ulStyling)}>
      {linkedData.map(({ headline, url, icon, 'icon-alt': iconAlt, 'icon-dark': iconDark }, index) => {
        const iconSrc = getSuitableIcon(icon, Boolean(iconDark), darkMode);
        return (
          <SideNavItem key={index} className={cx(liStyling)} as={Link} to={url} data-position={DATA_TOC_NODE}>
            <img height={16} width={16} src={iconSrc} alt={iconAlt} />
            <span>{headline}</span>
          </SideNavItem>
        );
      })}
    </ul>
  );
};

export default IALinkedData;
