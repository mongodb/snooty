import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Option, Select as LGSelect } from '@leafygreen-ui/select';
import PropTypes from 'prop-types';
import { theme } from '../theme/docsTheme';
import '../styles/select.css';

const Label = styled('p')`
  font-size: ${theme.fontSize.small};
  line-height: ${theme.fontSize.default};
  font-weight: bolder;
  letter-spacing: 0;
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin: 0 0 12px !important;
`;

const Select = ({ choices, onChange, defaultText = '', disabled = false, label = null, value = null, ...props }) => {
  return (
    <LGSelect
      className="lg-select"
      label={label}
      size="default"
      allowDeselect={false}
      placeholder={undefined}
      disabled={disabled}
      usePortal={false}
      popoverZIndex={5}
      defaultValue={value ? value : choices && choices.length && choices[0].value}
      onChange={(value) => {
        onChange(value);
      }}
    >
      {choices.map((choice) => (
        <Option className="option-item" key={choice.value} value={choice.value} role="option">
          {choice.icon && (
            <choice.icon
              css={css`
                display: inline-block;
                margin-right: ${theme.size.small};
                max-height: 20px;
                width: 30px;
              `}
            ></choice.icon>
          )}
          {choice.text}
        </Option>
      ))}
    </LGSelect>
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
