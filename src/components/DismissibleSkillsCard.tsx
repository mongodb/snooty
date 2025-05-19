import Card from '@leafygreen-ui/card';
import { Body, Link, Subtitle } from '@leafygreen-ui/typography';
import Box from '@leafygreen-ui/box';

import { css, cx } from '@leafygreen-ui/emotion';
import CloseButton from './Widgets/FeedbackWidget/components/CloseButton';
import SkillsBadgeIcon from './SVGs/SkillsBadgeIcon';

const cardStyles = css``;

const DismissibleSkillsCard = ({ skill, url }: { skill: string; url: string }) => {
  return (
    <Card className={cx(cardStyles)}>
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
