import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import PropTypes from 'prop-types';
import { theme } from '../theme/docsTheme';

const BORDER_SIZE = '1px';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
// This is the height of the closed select
const OPTIONS_POSITION_OFFSET = '36px';

const activeSelectStyles = css`
  border-bottom: none;
  /* Remove bottom border radius for seamless border transition */
  border-radius: 2px 2px 0 0;
  box-shadow: none;
  /* Remove the focus outline due to bottom being cut off by expanded element */
  :focus {
    outline: none;
  }
`;

const Label = styled('p')`
  font-weight: bolder;
  letter-spacing: 0;
  margin: 0 0 ${theme.size.tiny};
`;

const SelectedText = styled('p')`
  margin: 0;
`;

const Option = styled('li')`
  align-items: center;
  background-color: #fff;
  color: black;
  display: flex;
  overflow: hidden;
  padding: 10px ${theme.size.default};
  text-overflow: ellipsis;
  white-space: nowrap;
  :focus,
  :hover {
    background-color: rgba(231, 238, 236, 0.2);
  }
`;

const Options = styled('ul')`
  border: ${BORDER_SIZE} solid rgba(184, 196, 194, 0.4);
  border-radius: 0 0 2px 2px;
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(233, 233, 233, 0.3);
  left: -${BORDER_SIZE};
  padding: 0;
  position: absolute;
  margin: 0;
  top: ${OPTIONS_POSITION_OFFSET};
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
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px ${theme.size.default};
  position: relative;
`;

const Select = ({ choices, onChange, defaultText = '', disabled = false, label = null, value = null, ...props }) => {
  const enabled = useMemo(() => !disabled, [disabled]);
  const [selectText, setSelectText] = useState(defaultText);
  const [showOptions, setShowOptions] = useState(false);
  const toggleSelectExpand = useCallback(() => {
    if (enabled) setShowOptions(!showOptions);
  }, [enabled, showOptions]);
  /**
   * This useEffect should only be called once the component first renders with choices,
   * this should populate the select item with the default choice if there is one
   */
  useEffect(() => {
    if (choices.length && value) {
      const choice = choices.filter(choice => choice.value === value);
      if (choice && choice.length) {
        const currentChoice = choice[0];
        setSelectText(currentChoice.text);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices]);
  const showOptionsOnEnter = useCallback(
    e => {
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
    choice => {
      onChange(choice);
      setSelectText(choice.text);
      setShowOptions(false);
    },
    [onChange]
  );

  const optionOnEnter = useCallback(
    option => e => {
      if (e.keyCode === ENTER_KEY) {
        selectOption(option);
      }
    },
    [selectOption]
  );

  const closeOptionsOnBlur = useCallback(
    e => {
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
        tabIndex="0"
      >
        <SelectedOption showOptions={showOptions} role="option">
          <SelectedText>{selectText}</SelectedText>
          <Icon glyph={showOptions ? 'CaretUp' : 'CaretDown'} />
        </SelectedOption>
        {showOptions && (
          <Options>
            {choices.map(({ text, value }) => (
              <Option
                key={value}
                onClick={() => selectOption({ text, value })}
                onKeyDown={optionOnEnter({ text, value })}
                role="option"
                tabIndex="0"
              >
                {text}
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

export default Select;
