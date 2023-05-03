import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { ALL_VERSIONS, COMPARE_VERSIONS } from '../constants';

export default function VersionModeSegmentedControl({ versionMode, handleChange }) {
  return (
    <SegmentedControl key="changelog-view" value={versionMode} onChange={handleChange}>
      <SegmentedControlOption key="all-versions" value={ALL_VERSIONS}>
        All Versions
      </SegmentedControlOption>
      <SegmentedControlOption key="compare-versions" value={COMPARE_VERSIONS}>
        Compare Two Versions
      </SegmentedControlOption>
    </SegmentedControl>
  );
}
