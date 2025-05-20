import { useEffect, useState } from 'react';
import Card from '@leafygreen-ui/card';
import { Body, Link, Subtitle } from '@leafygreen-ui/typography';
import Box from '@leafygreen-ui/box';
import { css, cx } from '@leafygreen-ui/emotion';

import { palette } from '@leafygreen-ui/palette';
import { displayNone } from '../utils/display-none';
import { getSessionValue, setSessionValue } from '../utils/browser-storage';
import { isBrowser } from '../utils/is-browser';
import CloseButton from './Widgets/FeedbackWidget/components/CloseButton';
import SkillsBadgeIcon from './SVGs/SkillsBadgeIcon';

export const DISMISSIBLE_SKILLS_CARD_SHOWN = 'dismissible-skills-card-shown';
export const DISMISSIBLE_SKILLS_CARD_CLASSNAME = 'dismissible-skills-card';

const containerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;

  ${displayNone.onMobileAndTablet};

  .${DISMISSIBLE_SKILLS_CARD_SHOWN} & {
    display: none;
  }
`;

const cardStyles = css`
  padding: 16px;

  p {
    font-size: 13px;
    color: ${palette.gray.dark1};
  }
`;

const titleStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
`;

const hrStyles = css`
  width: 100%;
  margin: 8px 0;
  border-color: ${palette.gray.light2};
`;

const DismissibleSkillsCard = ({ skill, url }: { skill: string; url: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const hasBeenShown = getSessionValue(DISMISSIBLE_SKILLS_CARD_SHOWN);
    if (hasBeenShown) setIsOpen(false);
  }, []);

  const onClose = () => {
    setIsOpen(false);

    if (isBrowser) {
      const docClassList = window.document.documentElement.classList;
      docClassList.add(DISMISSIBLE_SKILLS_CARD_SHOWN);
      setSessionValue(DISMISSIBLE_SKILLS_CARD_SHOWN, true);
    }
  };

  if (!isOpen) return null;

  return (
    <Box className={cx(DISMISSIBLE_SKILLS_CARD_CLASSNAME, containerStyles)}>
      <Card className={cx(cardStyles)}>
        <Box className={cx(titleStyles)}>
          <SkillsBadgeIcon />
          <Subtitle>Earn a Skill Badge</Subtitle>
        </Box>
        <CloseButton onClick={onClose} />
        <Body color={palette.gray.dark1}>Master "{skill}" for free!</Body>
        <Link arrowAppearance={'persist'} baseFontSize={13}>
          Learn more
        </Link>
      </Card>
      <hr className={cx(hrStyles)} />
    </Box>
  );
};

export default DismissibleSkillsCard;
