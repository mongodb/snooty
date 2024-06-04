import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { css, Global } from '@emotion/react';
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

const ContentTransition = ({ children, slug }) => (
  <>
    <Global styles={fadeInOut} />
    <TransitionGroup>
      <CSSTransition
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
        classNames="fade"
        key={slug}
      >
        <div
          css={css`
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          `}
        >
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  </>
);

ContentTransition.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  slug: PropTypes.string,
};

export default ContentTransition;
