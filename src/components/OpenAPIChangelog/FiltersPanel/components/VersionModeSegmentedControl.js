import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { ALL_VERSIONS, COMPARE_VERSIONS } from '../constants';

export default function VersionModeSegmentedControl({ versionMode, handleVersionModeChange }) {
  return (
    <SegmentedControl key="changelog-view" value={versionMode} onChange={handleVersionModeChange}>
      <SegmentedControlOption key="all-versions" value={ALL_VERSIONS}>
        All Versions
      </SegmentedControlOption>
      <SegmentedControlOption key="compare-versions" value={COMPARE_VERSIONS}>
        Compare Two Versions
      </SegmentedControlOption>
    </SegmentedControl>
  );
}
