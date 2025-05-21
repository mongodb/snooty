import { useMemo } from 'react';
import Card from '@leafygreen-ui/card';
import { Body, Link, Subtitle } from '@leafygreen-ui/typography';
import Box from '@leafygreen-ui/box';
import { css, cx } from '@leafygreen-ui/emotion';

import { palette } from '@leafygreen-ui/palette';
import { isObject } from 'lodash';
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

const DismissibleSkillsCard = ({ skill, url, slug }: { skill: string; url: string; slug: string }) => {
  const shownClassname = useMemo(() => `${slug.split('/').join('-')}-${DISMISSIBLE_SKILLS_CARD_SHOWN}`, [slug]);

  const onClose = () => {
    if (isBrowser) {
      // Add to document classnames
      const docClassList = window.document.documentElement.classList;
      docClassList.add(shownClassname);

      // Add to session storage
      const sessionValue = getSessionValue(DISMISSIBLE_SKILLS_CARD_SHOWN);
      let shownDismissibleCards: { [k: string]: boolean } = {};
      if (sessionValue && isObject(sessionValue)) {
        shownDismissibleCards = {
          ...sessionValue,
        };
      }
      shownDismissibleCards[shownClassname] = true;

      setSessionValue(DISMISSIBLE_SKILLS_CARD_SHOWN, shownDismissibleCards);
    }
  };

  return (
    <Box
      className={cx(
        DISMISSIBLE_SKILLS_CARD_CLASSNAME,
        containerStyles,
        css`
          .${shownClassname} & {
            display: none;
          }
        `
      )}
    >
      <Card className={cx(cardStyles)}>
        <Box className={cx(titleStyles)}>
          <SkillsBadgeIcon />
          <Subtitle>Earn a Skill Badge</Subtitle>
        </Box>
        <CloseButton onClick={onClose} />
        <Body color={palette.gray.dark1}>Master "{skill}" for free!</Body>
        <Link arrowAppearance={'persist'} baseFontSize={13} href={url} hideExternalIcon>
          Learn more
        </Link>
      </Card>
      <hr className={cx(hrStyles)} />
    </Box>
  );
};

export default DismissibleSkillsCard;
