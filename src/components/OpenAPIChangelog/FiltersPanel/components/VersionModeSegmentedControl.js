import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';

export default function VersionModeSegmentedControl({ versionMode, handleChange }) {
  return (
    <SegmentedControl value={versionMode} onChange={handleChange}>
      <SegmentedControlOption data-testid="all-versions-option" value={false}>
        All Versions
      </SegmentedControlOption>
      <SegmentedControlOption data-testid="version-control-option" value={true}>
        Compare Two Versions
      </SegmentedControlOption>
    </SegmentedControl>
  );
}
