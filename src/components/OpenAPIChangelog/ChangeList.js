import { useState } from 'react';
import styled from '@emotion/styled';
import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';

const Wrapper = styled.div`
  width: 100%;
`;

const ALL_VERSIONS = 'allVersions';
const COMPARE_VERSIONS = 'compareVersions';

const ChangeList = () => {
  const [ChangelogView, setChangelogView] = useState(ALL_VERSIONS);

  function handleChangelogViewChange(value) {
    setChangelogView(value);
  }
  return (
    <Wrapper>
      <SegmentedControl key="changelog-view" value={ChangelogView} onChange={handleChangelogViewChange}>
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

export default ChangeList;
