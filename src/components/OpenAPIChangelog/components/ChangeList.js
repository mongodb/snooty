import styled from '@emotion/styled';
import { COMPARE_VERSIONS } from '../utils/constants';

import ReleaseDateBlock from './ReleaseDateBlock';
import ResourceChangesBlock from './ResourceChangesBlock';

const Wrapper = styled.div`
  width: 100%;
`;

const ChangeList = ({ versionMode, changes }) => {
  const ChangeListComponent = versionMode === COMPARE_VERSIONS ? ResourceChangesBlock : ReleaseDateBlock;

  return (
    <Wrapper>
      {changes.map((data, i) => (
        <ChangeListComponent key={`change-list-${i}`} {...data} />
      ))}
    </Wrapper>
  );
};

export default ChangeList;
