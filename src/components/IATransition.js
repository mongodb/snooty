import React from 'react';
import PropTypes from 'prop-types';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { css, Global } from '@emotion/core';
import ConditionalWrapper from './ConditionalWrapper';

const fadeOut = css`
  .slide-exit {
    opacity: 1;
  }
  .slide-exit-active {
    opacity: 0;
    transition: opacity 100ms;
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
    transition: opacity 300ms, transform 300ms ease-out;
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
    transition: opacity 300ms, transform 300ms ease-out;
  }
`;

const IATransition = ({ back, children, hasIA, slug }) => (
  <ConditionalWrapper
    condition={hasIA}
    wrapper={(kids) => (
      <>
        <Global styles={back ? backStyle : forwardStyle} />
        <SwitchTransition>
          <CSSTransition
            addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
            classNames="slide"
            key={slug}
          >
            <div>{kids}</div>
          </CSSTransition>
        </SwitchTransition>
      </>
    )}
  >
    {children}
  </ConditionalWrapper>
);

IATransition.propTypes = {
  back: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  hasIA: PropTypes.bool,
  slug: PropTypes.string,
};

export default IATransition;
