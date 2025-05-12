import Card from '@leafygreen-ui/card';
import { Body, Link, Subtitle } from '@leafygreen-ui/typography';
import Box from '@leafygreen-ui/box';

import { DismissibleSkillsCardNode } from '../types/ast';
import CloseButton from './Widgets/FeedbackWidget/components/CloseButton';
import SkillsBadgeIcon from './SVGs/SkillsBadgeIcon';

const DismissibleSkillsCard = ({
  nodeData: {
    options: { skill, url },
  },
}: {
  nodeData: DismissibleSkillsCardNode;
}) => {
  return (
    <Card>
      <Box>
        <SkillsBadgeIcon />
        <Subtitle>Earn a Skill Badge</Subtitle>
      </Box>
      <CloseButton onClick={() => {}} />
      <Body>Master "{skill}" for free!</Body>
      <Link>Learn more</Link>
    </Card>
  );
};

export default DismissibleSkillsCard;
