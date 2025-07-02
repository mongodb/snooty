import React, { useRef, forwardRef, ReactNode } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { Option, Select as LGSelect } from '@leafygreen-ui/select';
import { palette } from '@leafygreen-ui/palette';
import { color, focusRing } from '@leafygreen-ui/tokens';
import Icon, { LGGlyph } from '@leafygreen-ui/icon';
import { theme } from '../theme/docsTheme';
import { isOfflineDocsBuild } from '../utils/is-offline-docs-build';

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
    text-align: left;
    ${isOfflineDocsBuild && `color: ${palette.black}`};

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

const OFFLINE_SELECT_ID = 'offline-select';

const PortalContainer = forwardRef<HTMLDivElement, { className?: string; children: ReactNode }>(({ ...props }, ref) => (
  <div id={isOfflineDocsBuild ? OFFLINE_SELECT_ID : undefined} className={cx(portalStyle, props.className)} ref={ref}>
    {props.children}
  </div>
));

const offlineMenuStyling = css`
  position: absolute;
  background: white;
  font-size: 13px;
  width: 100%;
`;

const offlineListStyle = css`
  list-style: none;
  padding: 8px 0px;
  border-radius: 12px;
  box-shadow: rgba(0, 30, 43, 0.25) 0px 4px 7px 0px;
  margin: 6px 0 0 0;
  max-height: 250px;
`;

const offlineListItemStyle = css`
  display: flex;
  width: 100%;
  outline: none;
  overflow-wrap: anywhere;
  position: relative;
  padding: 8px 12px;
  cursor: pointer;
  color: ${palette.gray.dark3};
  align-items: center;
  line-height: ${theme.fontSize.default};

  &:hover {
    background-color: ${palette.gray.light2};
  }

  svg {
    opacity: 0;
    margin-right: 6px;
  }

  &[selected='true'] {
    font-weight: bold;
    svg {
      opacity: 1;
    }
  }
`;

export const OfflineMenu = ({ choices, className }: { choices: Array<SelectOption>; className?: string }) => {
  return (
    <div className={cx(offlineMenuStyling, 'offline-select-menu', className)}>
      <ul className={cx(offlineListStyle)}>
        {choices.map((choice, idx) => (
          <li
            className={cx('offline-select-choice', offlineListItemStyle)}
            data-value={choice.value}
            data-text={choice.text}
            key={idx}
          >
            <Icon fill={palette.blue.base} glyph={'Checkmark'} />
            <span>{choice.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export type SelectOption = {
  text: string;
  value: string;
  icon?: LGGlyph.Element;
  tabSelectorIcon?: React.ComponentType<{ className?: string }>;
};

export type SelectProps = {
  className?: string;
  choices: Array<SelectOption>;
  onChange: ({ value }: { value: string }) => void;
  usePortal?: boolean;
  defaultText?: string;
  disabled?: boolean;
  label?: string;
  value?: string;
};

const Select = ({
  className,
  choices,
  onChange,
  usePortal = true,
  defaultText = '',
  disabled = false,
  label,
  value = '',
  ...props
}: SelectProps) => {
  // show select after portal container has loaded for scroll + zindex consistency
  const portalContainer = useRef<HTMLDivElement>(null);

  return (
    <PortalContainer
      className={`${className} ${cx(selectWrapperStyle, labelStyle, { [disabledLabelStyle]: disabled })}`}
      ref={portalContainer}
    >
      <LGSelect
        data-testid="lg-select"
        value={value}
        // Only one is allowed (label or aria-labelledby)
        {...(label ? { label } : { 'aria-labelledby': 'select' })}
        size="default"
        allowDeselect={false}
        disabled={disabled}
        usePortal={usePortal}
        portalContainer={portalContainer.current}
        scrollContainer={portalContainer.current}
        popoverZIndex={2}
        placeholder={defaultText}
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
            {...({ role: 'option' } as React.HTMLAttributes<HTMLLIElement>)}
          >
            {choice.tabSelectorIcon && <choice.tabSelectorIcon className={cx(iconStyle)} />}
            {choice.text}
          </Option>
        ))}
      </LGSelect>
      {isOfflineDocsBuild && <OfflineMenu choices={choices} />}
    </PortalContainer>
  );
};

export { Select as default, Label };
