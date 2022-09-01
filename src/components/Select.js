import React, { useRef, forwardRef, useEffect, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { Option, Select as LGSelect } from '@leafygreen-ui/select';
import PropTypes from 'prop-types';
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

const optionStyling = css`
  align-items: center;

  & > span > svg {
    display: none;
  }
`;

const buttonContentStyling = css`
  & > button > div > div > div {
    display: flex;
    align-items: center;
  }
`;

const iconStyling = css`
  display: inline-block;
  margin-right: ${theme.size.small};
  max-height: 20px;
  width: 30px;
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
  defaultText = '',
  disabled = false,
  label = null,
  value = null,
  ...props
}) => {
  // show select after portal container has loaded for scroll + zindex consistency
  const portalContainer = useRef();
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    if (portalContainer.current && !showSelect) {
      setShowSelect(true);
    }
  }, [showSelect]);

  return (
    <PortalContainer className={className} ref={portalContainer}>
      {showSelect && (
        <LGSelect
          data-testid="lg-select"
          className={cx(buttonContentStyling)}
          value={value || ''}
          label={label}
          aria-labelledby={(!label && 'select') || null}
          size="default"
          allowDeselect={false}
          disabled={disabled}
          portalContainer={portalContainer.current}
          scrollContainer={portalContainer.current}
          popoverZIndex={2}
          placeholder={defaultText}
          defaultValue={value ? String(value) : ''}
          onChange={(value) => {
            onChange({ value });
          }}
        >
          {choices.map((choice) => (
            <Option className={cx(optionStyling)} key={choice.value} value={choice.value} role="option">
              {choice.icon && <choice.icon className={cx(iconStyling)} />}
              {choice.text}
            </Option>
          ))}
        </LGSelect>
      )}
    </PortalContainer>
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
