import React from 'react';
import PropTypes from 'prop-types';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { css, Global } from '@emotion/core';

const fadeOut = css`
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity 100ms;
  }
`;

const fadeIn = css`
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 300ms;
  }
`;

const fadeInOut = css`
  ${fadeOut}
  ${fadeIn}
`;

const ContentTransition = ({ children, slug }) => (
  <>
    <Global styles={fadeInOut} />
    <SwitchTransition>
      <CSSTransition
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
        classNames="fade"
        key={slug}
      >
        <div
          css={css`
            grid-area: contents;
            margin: 0px;
            overflow-y: auto;
          `}
        >
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  </>
);

ContentTransition.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  slug: PropTypes.string,
};

export default ContentTransition;
