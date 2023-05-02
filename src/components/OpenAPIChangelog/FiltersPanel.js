import styled from '@emotion/styled';
import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { ALL_VERSIONS, COMPARE_VERSIONS } from './OpenAPIChangelog';
const Wrapper = styled.div`
  width: 100%;
`;

const FiltersPanel = ({ changeLogView, handleChange }) => {
  return (
    <Wrapper>
      <SegmentedControl key="changelog-view" value={changeLogView} onChange={handleChange}>
        <SegmentedControlOption key="all-versions" value={ALL_VERSIONS}>
          All Versions
        </SegmentedControlOption>
        <SegmentedControlOption key="compare-versions" value={COMPARE_VERSIONS}>
          Compare Two Versions
        </SegmentedControlOption>
      </SegmentedControl>
    </Wrapper>
  );
};

export default FiltersPanel;
