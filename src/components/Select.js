import React, { useRef, forwardRef, useId } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { Option, Select as LGSelect } from '@leafygreen-ui/select';
import PropTypes from 'prop-types';
import { palette } from '@leafygreen-ui/palette';
import { color, focusRing } from '@leafygreen-ui/tokens';
import { theme } from '../theme/docsTheme';

const Label = styled('p')`
  font-size: ${theme.fontSize.small};
  line-height: ${theme.fontSize.default};
  font-weight: bolder;
  letter-spacing: 0;
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin: 0 0 12px !important;
`;

const portalStyle = css`
  position: relative;
`;

const iconStyle = css`
  display: inline-block;
  margin-right: ${theme.size.small};
  max-height: 20px;
  width: 30px;
`;

/* Override LG mobile style of enlarged mobile font */
const selectWrapperStyle = css`
  @media ${theme.screenSize.upToLarge} {
    label,
    p,
    button,
    div,
    span {
      font-size: ${theme.fontSize.small};
    }
  }
`;

const labelStyle = css`
  label {
    color: ${color.light.text.primary.default};

    .dark-theme & {
      color: ${color.dark.text.primary.default};
    }
  }
`;

const disabledLabelStyle = css`
  label {
    color: ${color.light.text.disabled.default};

    .dark-theme & {
      color: ${color.dark.text.disabled.default};
    }
  }
`;

const selectStyle = css`
  > button {
    background-color: ${color.light.background.primary.default};

    // Override button default color
    > *:last-child {
      > svg {
        color: ${color.light.icon.primary.default};
      }
    }

    &:focus-visible {
      box-shadow: ${focusRing.light.input};
      border-color: rgba(255, 255, 255, 0);
    }

    .dark-theme & {
      border-color: ${color.dark.border.primary.default};
      background-color: ${palette.gray.dark4};

      // Override button default color
      > *:last-child {
        > svg {
          color: ${color.dark.icon.primary.default};
        }
      }
    }
  }
`;

const enabledSelectHoverStyles = css`
  > button {
    .dark-theme & {
      &:hover,
      &:active,
      &:focus {
        background-color: ${palette.gray.dark4};
        color: ${color.dark.text.primary.hover};
      }

      &:focus-visible {
        background-color: ${palette.gray.dark4};
        box-shadow: ${focusRing.dark.input};
        border-color: rgba(255, 255, 255, 0);
      }
    }
  }
`;

const disabledSelectStyles = css`
  > button {
    cursor: not-allowed;
    pointer-events: unset;
    box-shadow: unset;

    &:active {
      pointer-events: none;
    }

    &[aria-disabled='true'] {
      background-color: ${color.light.background.disabled.default};
      border-color: ${color.light.border.disabled.default};

      .dark-theme & {
        background-color: ${color.dark.background.disabled.default};
        border-color: ${color.dark.border.disabled.default};
      }

      &:hover,
      &:active {
        box-shadow: inherit;
      }

      > *:last-child {
        > svg {
          color: ${color.light.icon.disabled.default};

          .dark-theme & {
            color: ${color.dark.icon.disabled.default};
          }
        }
      }
    }
  }
`;

const optionStyling = css`
  align-items: center;

  & > span > svg {
    display: none;
  }
`;

const PortalContainer = forwardRef(({ ...props }, ref) => (
  <div className={cx(portalStyle, props.className)} ref={ref}>
    {props.children}
  </div>
));

const Select = ({
  className,
  choices,
  onChange,
  id,
  usePortal = true,
  defaultText = '',
  disabled = false,
  label = null,
  value = null,
  ...props
}) => {
  // show select after portal container has loaded for scroll + zindex consistency
  const portalContainer = useRef();
  const defaultId = useId();

  return (
    <PortalContainer
      className={`${className} ${cx(selectWrapperStyle, labelStyle, { [disabledLabelStyle]: disabled })}`}
      ref={portalContainer}
    >
      <LGSelect
        data-testid="lg-select"
        value={value || ''}
        id={id || defaultId}
        label={label}
        aria-labelledby={(!label && 'select') || null}
        size="default"
        allowDeselect={false}
        disabled={disabled}
        usePortal={usePortal}
        portalContainer={portalContainer.current}
        scrollContainer={portalContainer.current}
        popoverZIndex={2}
        placeholder={defaultText}
        defaultValue={value ? String(value) : ''}
        onChange={(value) => {
          onChange({ value });
        }}
        className={cx(selectStyle, disabled ? disabledSelectStyles : enabledSelectHoverStyles)}
        {...props}
      >
        {choices.map((choice) => (
          <Option
            className={cx(optionStyling)}
            key={choice.value}
            value={choice.value}
            glyph={choice.icon}
            role="option"
          >
            {choice.tabSelectorIcon && <choice.tabSelectorIcon className={cx(iconStyle)} />}
            {choice.text}
          </Option>
        ))}
      </LGSelect>
      {process.env['OFFLINE_DOCS'] === 'true' && <OfflineMenu id={id || defaultId} choices={choices}></OfflineMenu>}
    </PortalContainer>
  );
};

const StyledMenu = styled('div')`
  display: none;
  position: absolute;
  top: 100%;

  ul {
    list-style: none;
    font-size: ${theme.fontSize.default};
  }

  li.selected {
    font-weight: bold;
  }
`;

const OfflineMenu = ({ choices, id }) => {
  return (
    <StyledMenu id={id}>
      <ul>
        {choices.map((choice) => {
          return (
            <li value={choice.value}>
              <span>{choice.text}</span>
            </li>
          );
        })}
      </ul>
    </StyledMenu>
  );
};

Select.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  usePortal: PropTypes.bool,
  defaultText: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
};

Select.defaultProps = {
  usePortal: true,
  defaultText: '',
  disabled: false,
  label: null,
  value: null,
};

export { Select as default, Label };
