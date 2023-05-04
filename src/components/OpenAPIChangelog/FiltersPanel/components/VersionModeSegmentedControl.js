import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { ALL_VERSIONS, COMPARE_VERSIONS } from '../constants';

export default function VersionModeSegmentedControl({ versionMode, handleChange }) {
  return (
    <SegmentedControl value={versionMode} onChange={handleChange}>
      <SegmentedControlOption data-testid="all-versions-option" value={ALL_VERSIONS}>
        All Versions
      </SegmentedControlOption>
      <SegmentedControlOption data-testid="version-control-option" value={COMPARE_VERSIONS}>
        Compare Two Versions
      </SegmentedControlOption>
    </SegmentedControl>
  );
}
