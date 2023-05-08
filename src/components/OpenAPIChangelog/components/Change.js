import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import Tooltip, { Align, Justify } from '@leafygreen-ui/tooltip';
import Icon from '@leafygreen-ui/icon';

const ChangeListItem = styled.li`
  margin-top: 12px;
  line-height: 28px;
`;

export const Flex = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const LIWrapper = styled(Flex)`
  height: 28px;
`;

const Change = ({ change, backwardCompatible }) => {
  const changeStatement = change[0].toUpperCase() + change.slice(1);

  return (
    <ChangeListItem>
      <LIWrapper>
        {!backwardCompatible && (
          <Tooltip
            align={Align.Top}
            justify={Justify.Middle}
            trigger={
              <Flex>
                <Icon glyph="ImportantWithCircle" fill={palette.red.base} />
              </Flex>
            }
          >
            Breaking change
          </Tooltip>
        )}
        {changeStatement}
      </LIWrapper>
    </ChangeListItem>
  );
};

export default Change;
