import React from 'react';
import { Option, Select } from '@leafygreen-ui/select';
import { css, cx } from '@leafygreen-ui/emotion';
import { ComposableTutorialOption } from '../../types/ast';

const selectStyling = css`
  flex: 1 0 auto;
`;

interface ConfigurationOptionProps {
  option: ComposableTutorialOption;
  selections: Record<string, string>;
  showComposable: (dependencies: Record<string, string>[]) => boolean;
  onSelect: (value: string, option: string) => void;
}

const ConfigurableOption = ({ option, selections, onSelect, showComposable }: ConfigurationOptionProps) => {
  if (!showComposable(option.dependencies)) {
    return null;
  }

  return (
    <Select
      className={cx(selectStyling)}
      label={option.text}
      allowDeselect={false}
      value={selections[option.value]}
      aria-label={`Select your ${option.text}`}
      onChange={(value) => onSelect(value, option.value)}
    >
      {option.selections.map((selection, i) => (
        <Option value={selection.value} key={i}>
          {selection.text}
        </Option>
      ))}
    </Select>
  );
};

export default ConfigurableOption;
