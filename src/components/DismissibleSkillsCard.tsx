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
import { theme } from '../theme/docsTheme';
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
`;

const cardStyles = css`
  padding: ${theme.fontSize.default};
  border-radius: 12px;

  p {
    font-size: ${theme.fontSize.small};
    color: ${palette.gray.dark1};

    .dark-theme & {
      color: ${palette.gray.light1};
    }
  }
`;

const titleStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.size.small};
  padding-right: 12px;

  svg > path {
    .dark-theme & {
      fill: ${palette.white};
    }
  }
`;

const hrStyles = css`
  width: 100%;
  margin: ${theme.size.small} 0;
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
      const shownDismissibleCards: { [k: string]: boolean } = {
        ...(sessionValue && isObject(sessionValue) ? sessionValue : {}),
        [shownClassname]: true,
      };

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
        <Body>Master "{skill}" for free!</Body>
        <Link arrowAppearance={'persist'} baseFontSize={13} href={url} hideExternalIcon>
          Learn more
        </Link>
      </Card>
      <hr className={cx(hrStyles)} />
    </Box>
  );
};

export default DismissibleSkillsCard;
