import React from 'react';
// import VersionDropdown from '../VersionDropdown';
import VersionSelector from '../Sidenav/VersionSelector';
// import useSnootyMetadata from '../../utils/use-snooty-metadata';

export function UnifiedVersionDropdown({ contentSite }) {
  // const { project } = useSnootyMetadata();

  return <VersionSelector versionedProject={contentSite} />;

  // if (contentSite === project) {
  //   return <VersionDropdown />;
  // } else {

  // }
}
