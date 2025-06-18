import React, { ReactNode } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { css, Global } from '@emotion/react';
import ConditionalWrapper from '../ConditionalWrapper';
import { theme } from '../../theme/docsTheme';

const fadeOut = css`
  .slide-exit {
    opacity: 1;
  }
  .slide-exit-active {
    opacity: 0;
    transition: opacity ${theme.transitionSpeed.iaExit};
  }
`;

const backStyle = css`
  ${fadeOut}

  .slide-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  .slide-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: opacity ${theme.transitionSpeed.iaEnter}, transform ${theme.transitionSpeed.iaEnter} ease-out;
  }
`;

const forwardStyle = css`
  ${fadeOut}

  .slide-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slide-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: opacity ${theme.transitionSpeed.iaEnter}, transform ${theme.transitionSpeed.iaEnter} ease-out;
  }
`;

export type IATransitionProps = {
  back: boolean;
  children: ReactNode;
  hasIA: boolean;
  slug: string;
};

const IATransition = ({ back, children, hasIA, slug }: IATransitionProps) => (
  <ConditionalWrapper
    condition={hasIA}
    wrapper={(children) => (
      <>
        <Global styles={back ? backStyle : forwardStyle} />
        <SwitchTransition>
          <CSSTransition
            timeout={{
              enter: theme.size.stripUnit(theme.transitionSpeed.iaEnter),
              exit: theme.size.stripUnit(theme.transitionSpeed.iaExit),
            }}
            classNames="slide"
            key={slug}
          >
            <div>{children}</div>
          </CSSTransition>
        </SwitchTransition>
      </>
    )}
  >
    {children}
  </ConditionalWrapper>
);

export default IATransition;
