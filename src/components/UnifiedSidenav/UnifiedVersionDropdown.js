import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import { Option, Select } from '@leafygreen-ui/select';
import { useLocation } from '@gatsbyjs/reach-router';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';

const selectStyling = LeafyCSS`
  margin: ${theme.size.small} ${theme.size.medium} ${theme.size.small} ${theme.size.medium};

  ${'' /* Render version dropdown text in front of the Sidebar text */}
  button {
    z-index: 2;
    background-color: var(--select-button-bg-color);
    color: var(--select-button-color);

    div:last-child svg {
      color: var(--select-button-carot);
    }

    .dark-theme &:hover {
      background-color: var(--gray-dark4);
      color: var(--gray-light3);
      border-color: var(--gray-base);
      box-shadow: var(--gray-dark2) 0px 0px 0px 3px;
    }
  }

  /* Override LG mobile style of enlarged mobile font */
  @media ${theme.screenSize.upToLarge} {
    div,
    span {
      font-size: ${theme.fontSize.small};
    }
  }
`;

const UnifiedVersionDropdown = ({ versionData }) => {
  const { snootyEnv } = useSiteMetadata();
  const { project } = useSnootyMetadata();
  const { activeVersions, onTomlVersion } = useContext(VersionContext);
  const location = useLocation();

  // value is the version we want to switch to
  const onSelectChange = useCallback(
    (value, key) => {
      onTomlVersion(project, value, location.pathname, snootyEnv);
    },
    [onTomlVersion, project, location, snootyEnv]
  );

  const unifiedOption = (slug, verName, label) => {
    return (
      <Option key={slug} value={verName}>
        {label}
      </Option>
    );
  };

  return (
    <Select
      role="button"
      allowDeselect={false}
      className={cx(selectStyling)}
      aria-labelledby="View a different version of documentation."
      defaultValue="master"
      onChange={onSelectChange}
      placeholder={'Select a version'}
      popoverZIndex={3}
      value={activeVersions[project]}
      usePortal={false}
      disabled={isOfflineDocsBuild}
    >
      {versionData.version.map((v) => unifiedOption(v.urlSlug, v.name, v.versionSelectorLabel))}
      {/* TODO: make the version selector to work with grouped data and eol data */}
    </Select>
  );
};

UnifiedVersionDropdown.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default UnifiedVersionDropdown;
