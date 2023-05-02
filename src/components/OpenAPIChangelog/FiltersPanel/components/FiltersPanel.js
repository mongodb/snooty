import styled from '@emotion/styled';
import VersionModeSegmentedControl from './VersionModeSegmentedControl';
import ResourceSelect from './ResourceSelect';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const FiltersPanel = ({ versionMode, handleVersionModeChange }) => {
  return (
    <Wrapper>
      <VersionModeSegmentedControl versionMode={versionMode} handleVersionModeChange={handleVersionModeChange} />
      <ResourceSelect />
    </Wrapper>
  );
};

export default FiltersPanel;
