import React from 'react';
import PropTypes from 'prop-types';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { css, Global } from '@emotion/core';
import { theme } from '../theme/docsTheme';

const fadeOut = css`
  .slide-exit {
    opacity: 1;
  }
  .slide-exit-active {
    opacity: 0;
    transition: opacity ${theme.transitionSpeed.contentFadeOut};
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
    transition: opacity ${theme.transitionSpeed.contentFadeIn},
      transform ${theme.transitionSpeed.contentFadeIn} ease-out;
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
    transition: opacity 200ms, transform 200ms ease-out;
  }
`;

const IATransition = ({ back, children, hasIA, slug }) => (
  <>
    <Global styles={back ? backStyle : forwardStyle} />
    <SwitchTransition>
      <CSSTransition
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
        classNames="slide"
        key={slug}
      >
        <div>{children}</div>
      </CSSTransition>
    </SwitchTransition>
  </>
);

IATransition.propTypes = {
  back: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  slug: PropTypes.string,
};

export default IATransition;
