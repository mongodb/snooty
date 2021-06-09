import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { css, Global } from '@emotion/core';
import { CONTENT_CONTAINER_CLASSNAME } from '../constants';

const FADEOUT_DURATION = '100ms';

const fadeOut = css`
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity ${FADEOUT_DURATION};
  }
`;

const fadeIn = css`
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 200ms ${FADEOUT_DURATION};
  }
`;

const fadeInOut = css`
  ${fadeOut}
  ${fadeIn}
`;

const ContentTransition = ({ children, slug }) => (
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
        {children}
      </CSSTransition>
    </TransitionGroup>
  </>
);

ContentTransition.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  slug: PropTypes.string,
};

export default ContentTransition;
