import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { css, Global } from '@emotion/core';
import { CONTENT_CONTAINER_CLASSNAME } from '../constants';
import { theme } from '../theme/docsTheme';
import { isBrowser } from '../utils/is-browser';

const fadeOut = css`
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity ${theme.transitionSpeed.contentFadeOut};
  }
`;

const fadeIn = css`
  .fade-enter {
    // Set height to 0 to prevent content from jumping
    height: 0px;
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    // Add delay so that fade in transition doesn't begin until the previous page has finished fading out
    transition: opacity ${theme.transitionSpeed.contentFadeIn} ${theme.transitionSpeed.contentFadeOut} ease-out;
  }
`;

const fadeInOut = css`
  ${fadeOut}
  ${fadeIn}
`;

const ContentTransition = ({ children, slug }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isBrowser) {
      // Focus on the page's content first by default to allow page scroll navigation for keyboard
      contentRef.current.focus();
    }
  }, [slug]);

  return (
    <>
      <Global styles={fadeInOut} />
      <TransitionGroup
        className={CONTENT_CONTAINER_CLASSNAME}
        css={css`
          grid-area: contents;
          margin: 0px;
          overflow-y: auto;
        `}
      >
        <CSSTransition
          addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
          classNames="fade"
          key={slug}
        >
          <div
            css={css`
              min-height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              outline: none;
            `}
            tabIndex="-1"
            ref={contentRef}
          >
            {children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

ContentTransition.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  slug: PropTypes.string,
};

export default ContentTransition;
