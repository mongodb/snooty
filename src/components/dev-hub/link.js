import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link as RouterLink } from 'gatsby';
import { colorMap } from './theme';

// Takes an event handler, and wraps it to call preventDefault.
// If the handler is falsey, it is returned unchanged.
export const wrapPreventDefault = (handler, href) => {
  if (!handler) {
    return handler;
  }

  return e => {
    if (!href) {
      e.preventDefault();
    }
    return handler(e);
  };
};
const handleEnter = handler => e => {
  e.which === 13 && handler && wrapPreventDefault(handler)(e);
};

export const _validateUrlProp = (props, propName, clashingPropName) => {
  const currentProp = props[propName];
  if (currentProp) {
    if (props[clashingPropName]) {
      return new Error(
        `Both \`${propName}\` and \`${clashingPropName}\` props values were provided to \`Link\`. The \`${propName}\` prop will be used.`
      );
    }
    if (typeof currentProp !== 'string') {
      return new Error(`\`${propName}\` must be a string`);
    }
  }
  // passed validation
  return null;
};

// Extra props to pass when href is not specified.
// These help the link look and feel more like a link,
// even though the browser doesn't consider it a link.
const BUTTON_PROPS = {
  role: 'button',
  tabIndex: 0,
};

const linkStyling = css`
  color: ${colorMap.greyLightThree};
  display: block;
  &:hover {
    cursor: pointer;
    color: ${colorMap.magenta};
    text-decoration: none;
    transition: color 0.1s ease 0.1s;
  }

  &:after {
    /* 2192 is "RIGHTWARDS ARROW" */
    content: ' \u2192';
  }
`;

const ExternalLink = styled('a')`
  ${linkStyling}
`;

const InternalLink = styled(RouterLink)`
  ${linkStyling};
`;

/**
 * @param {Object<string, any>} props
 * @property {node} props.children
 * @property {string?} props.href
 * @property {func?} props.onClick
 * @property {string?} props.target
 * @property {string?} props.to
 */
const Link = ({ children, href, onClick, target, to, ...rest }) => {
  if (to) {
    return (
      <InternalLink onClick={onClick} to={to} {...rest}>
        {children}
      </InternalLink>
    );
  }
  return (
    <ExternalLink
      href={href}
      onClick={wrapPreventDefault(onClick, href)}
      onKeyPress={href ? undefined : handleEnter(onClick)}
      rel={target === '_blank' ? 'noreferrer noopener' : void 0}
      target={target}
      {...(typeof href === 'undefined' ? BUTTON_PROPS : null)}
      {...rest}
    >
      {children}
    </ExternalLink>
  );
};

Link.displayName = 'Link';

export default Link;
