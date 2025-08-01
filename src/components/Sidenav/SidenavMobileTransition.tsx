import React, { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';
import { css, Global } from '@emotion/react';
import ConditionalWrapper from '../ConditionalWrapper';
import { theme } from '../../theme/docsTheme';

const ENTER_DURATION = theme.size.stripUnit(theme.transitionSpeed.iaEnter);
const EXIT_DURATION = theme.size.stripUnit(theme.transitionSpeed.iaExit);
const TRANSITION_NAME = 'sidenav-mobile';

const globalCSS = css`
  .${TRANSITION_NAME}-enter {
    transform: translateY(-100%);
  }
  .${TRANSITION_NAME}-enter-active {
    transform: translateY(0);
    transition: transform ${ENTER_DURATION}ms ease-in-out;
  }
  .${TRANSITION_NAME}-exit {
    display: initial !important;
    opacity: 1;
  }
  .${TRANSITION_NAME}-exit-active {
    display: initial !important;
    opacity: 0;
    transition: all ${EXIT_DURATION}ms ease-in;
  }
`;

export type SidenavMobileTransitionProps = {
  children: ReactNode;
  hideMobile: boolean;
  isMobile: boolean;
};

const SidenavMobileTransition = ({ children, hideMobile, isMobile }: SidenavMobileTransitionProps) => (
  <ConditionalWrapper
    condition={isMobile}
    wrapper={(children) => (
      <>
        <Global styles={globalCSS} />
        <CSSTransition
          timeout={{
            enter: ENTER_DURATION,
            exit: EXIT_DURATION,
          }}
          classNames={TRANSITION_NAME}
          in={!hideMobile}
        >
          {children}
        </CSSTransition>
      </>
    )}
  >
    {children}
  </ConditionalWrapper>
);

export default SidenavMobileTransition;
