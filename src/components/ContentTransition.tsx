import React, { ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { css, Global } from '@emotion/react';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import { theme } from '../theme/docsTheme';

const fadeOut = css`
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity ${theme.transitionSpeed.contentFade};
  }
`;

const fadeIn = css`
  .fade-enter {
    // Set height to 0 to prevent content from jumping
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    // Add delay so that fade in transition doesn't begin until the previous page has finished fading out
    transition: opacity ${theme.transitionSpeed.contentFade} ease-in-out;
  }
`;

const fadeInOut = css`
  ${fadeOut}
  ${fadeIn}
`;

const innerContainerStyles = LeafyCss`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentTransition = ({ children, slug }: { children: ReactNode; slug: string }) => (
  <>
    <Global styles={fadeInOut} />
    <TransitionGroup>
      <CSSTransition
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
        classNames="fade"
        key={slug}
      >
        <div className={cx(innerContainerStyles, 'content-transition-div')}>{children}</div>
      </CSSTransition>
    </TransitionGroup>
  </>
);

export default ContentTransition;
