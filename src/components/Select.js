import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import PropTypes from 'prop-types';
import { theme } from '../theme/docsTheme';

const BORDER_SIZE = '1px';
// Dropdown should scroll after this height
const DROPDOWN_MAX_HEIGHT = '160px';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
// This is the height of the closed select
const OPTIONS_POSITION_OFFSET = '36px';
// This is the height of the closed select when an icon is displayed
const OPTIONS_ICON_POSITION_OFFSET = '48px';

const activeSelectStyles = css`
  border-bottom-color: transparent;
  /* Remove bottom border radius for seamless border transition */
  border-radius: 2px 2px 0 0;
  box-shadow: none;
  :focus {
    outline: none;
  }
`;

const Label = styled('p')`
  font-size: ${theme.fontSize.small};
  line-height: ${theme.fintSize.default};
  font-weight: bolder;
  letter-spacing: 0;
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin: 0 0 12px !important;
`;

const SelectedText = styled('p')`
  display: inline-block;
  font-family: Akzidenz;
  font-size: ${theme.fontSize.small};
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin: 0 !important;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Option = styled('li')`
  align-items: center;
  background-color: #fff;
  color: black;
  overflow: hidden;
  /* TODO: Remove !important when mongodb-docs.css is removed */
  /* Add padding equal to icon width + margin (44px) to left of option text */
  padding: ${({ hasIcons }) =>
    hasIcons
      ? `10px ${theme.size.default} 10px calc(${theme.size.default} + 44px)`
      : `10px ${theme.size.default}`} !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  :focus,
  :hover {
    background-color: #f6f9f8;
    cursor: pointer;
    outline: none;
  }
`;

const Options = styled('ul')`
  border: ${BORDER_SIZE} solid rgba(184, 196, 194, 0.4);
  border-radius: 0 0 2px 2px;
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(233, 233, 233, 0.3);
  left: -${BORDER_SIZE};
  max-height: ${DROPDOWN_MAX_HEIGHT};
  overflow-y: auto;
  padding: 0;
  position: absolute;
  margin: 0;
  top: ${({ hasIcons }) => (hasIcons ? OPTIONS_ICON_POSITION_OFFSET : OPTIONS_POSITION_OFFSET)};
  /* account for border */
  width: calc(100% + 2px);
  z-index: 5;
`;

const SelectContainer = styled('div')`
  font-size: ${theme.fontSize.small};
  letter-spacing: 0.5px;
  line-height: ${theme.size.default};
  opacity: ${({ enabled }) => (enabled ? 1 : 0.3)};
`;

const StyledCustomSelect = styled('div')`
  background-color: #fff;
  border: ${BORDER_SIZE} solid rgba(184, 196, 194, 0.4);
  border-radius: 2px;
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(233, 233, 233, 0.3);
  color: #000;
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'not-allowed')};
  position: relative;
  ${({ showOptions }) => showOptions && activeSelectStyles};
`;

const SelectedOption = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px ${theme.size.default};
`;

const Select = ({ choices, onChange, defaultText = '', disabled = false, label = null, value = null, ...props }) => {
  const enabled = useMemo(() => !disabled, [disabled]);
  const hasIcons = useMemo(() => choices.some((choice) => Object.hasOwnProperty.call(choice, 'icon')), [choices]);
  const [selected, setSelected] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const toggleSelectExpand = useCallback(() => {
    if (enabled) setShowOptions(!showOptions);
  }, [enabled, showOptions]);
  /**
   * This useEffect should only be called once the component first renders with choices,
   * this should populate the select item with the default choice if there is one.
   * If no choice is specified, "reset" the form.
   */
  useEffect(() => {
    if (choices.length && value) {
      const choice = choices.filter((choice) => choice.value === value);
      if (choice && choice.length) {
        const currentChoice = choice[0];
        setSelected(currentChoice);
      }
    } else {
      setSelected({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices, value]);
  const showOptionsOnEnter = useCallback(
    (e) => {
      if (e.keyCode === ENTER_KEY) {
        toggleSelectExpand();
      } else if (e.keyCode === ESCAPE_KEY && showOptions) {
        // Hitting the escape key should only close the select
        toggleSelectExpand();
      }
    },
    [showOptions, toggleSelectExpand]
  );

  const selectOption = useCallback(
    (choice) => {
      onChange(choice);
      setSelected(choice);
      setShowOptions(false);
    },
    [onChange]
  );

  const optionOnEnter = useCallback(
    (option) => (e) => {
      if (e.keyCode === ENTER_KEY) {
        selectOption(option);
      }
    },
    [selectOption]
  );

  const closeOptionsOnBlur = useCallback(
    (e) => {
      // Check the event to see if the next element would be a list element
      // otherwise, close the options
      const isTabbingThroughOptions = e.relatedTarget && e.relatedTarget.tagName === 'LI';
      if (!isTabbingThroughOptions) {
        setShowOptions(false);
      }
    },
    [setShowOptions]
  );
  return (
    <SelectContainer aria-disabled={disabled} enabled={enabled} {...props}>
      {label && <Label>{label}</Label>}
      <StyledCustomSelect
        aria-expanded={showOptions}
        enabled={enabled}
        onBlur={closeOptionsOnBlur}
        onClick={toggleSelectExpand}
        onKeyDown={showOptionsOnEnter}
        role="listbox"
        showOptions={showOptions}
        tabIndex={enabled ? '0' : null}
      >
        <SelectedOption showOptions={showOptions} role="option">
          {hasIcons ? (
            <div
              css={css`
                align-items: center;
                display: flex;
                height: 28px;
                flex: 1;
              `}
            >
              {selected.icon && (
                <selected.icon
                  css={css`
                    display: inline-block;
                    margin-right: ${theme.size.small};
                    max-height: 28px;
                    width: 36px;
                  `}
                />
              )}
              <SelectedText>{selected.text || defaultText}</SelectedText>
            </div>
          ) : (
            <SelectedText>{selected.text || defaultText}</SelectedText>
          )}
          <Icon glyph={showOptions ? 'CaretUp' : 'CaretDown'} />
        </SelectedOption>
        {showOptions && (
          <Options hasIcons={hasIcons}>
            {choices.map((choice) => (
              <Option
                hasIcons={hasIcons}
                key={choice.value}
                onClick={() => selectOption(choice)}
                onKeyDown={optionOnEnter(choice)}
                role="option"
                tabIndex="0"
              >
                {choice.text}
              </Option>
            ))}
          </Options>
        )}
      </StyledCustomSelect>
    </SelectContainer>
  );
};

Select.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultText: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
};

Select.defaultProps = {
  defaultText: '',
  disabled: false,
  label: null,
  value: null,
};

export { Select as default, Label };
