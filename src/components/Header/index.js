import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import { SidenavMobileMenuDropdown } from '../Sidenav';
import SiteBanner from '../Banner/SiteBanner';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { isBrowser } from '../../utils/is-browser';
import { VersionContext } from '../../context/version-context';
import { driversSet } from '../../utils/drivers-set';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Header = ({ sidenav, eol }) => {
  const { project } = useSiteMetadata();
  const { branch } = useSnootyMetadata();
  const { availableVersions } = useContext(VersionContext);

  const { node } = availableVersions;

  let version;

  // For some branches, such as master, the gitBranchName in the MongoDB collection differs
  // from the version selector label (e.g., node's master branch has a versionSelectorLabel of upcoming)
  // the gitBranchName needs to be mapped from the gitBranchName to the versionSelectorName as the
  // searchProperty field needs this value instead.
  // we filter here to find the correct MongoDB entry that contains the corresponding gitBranchName and then
  // pluck out the versionSelectorLabel
  const currRepoBranch = node?.filter((repoBranch) => repoBranch.gitBranchName === branch);

  if (!currRepoBranch || currRepoBranch.length === 0) {
    console.warn(`WARNING: No corresponding repo branch found for given git branch ${branch}`);
  } else {
    version = currRepoBranch[0].urlSlug;
  }

  let searchProperty;
  if (isBrowser) {
    const { searchParams } = new URL(window.location);
    searchProperty = searchParams.get('searchProperty');
  }
  const shouldSearchRealm = project === 'realm' || searchProperty === 'realm-master';
  const unifiedNavProperty = shouldSearchRealm ? 'REALM' : 'DOCS';

  const searchParams = [];
  if (driversSet.has(project)) {
    const projectManifest = `${project}-${version}`;

    searchParams.push({ param: 'searchProperty', value: projectManifest });
  }

  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        {!eol && <UnifiedNav position="relative" property={{ name: unifiedNavProperty, searchParams }} />}
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
  eol: PropTypes.bool.isRequired,
};

export default Header;
