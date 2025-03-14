import React, { useCallback } from 'react';
import { Option, Select } from '@leafygreen-ui/select';
import { ComposableTutorialOption } from '../../types/ast';

interface ConfigurationOptionProps {
  option: ComposableTutorialOption;
  selections: Record<string, string>;
  setCurrentSelections: React.Dispatch<Record<string, string>>;
  showComposable: (dependencies: Record<string, string>[]) => boolean;
}

const ConfigurableOption = ({ option, selections, setCurrentSelections, showComposable }: ConfigurationOptionProps) => {
  const onSelect = useCallback(
    (value: string) => {
      setCurrentSelections({ ...selections, [option.value]: value });
      // TODO: update local storage
      // TODO. change to routing instead of current selections
    },
    [option.value, selections, setCurrentSelections]
  );

  if (!showComposable(option.dependencies)) {
    return null;
  }

  return (
    <Select value={selections[option.value]} aria-labelledby={'null'} aria-label={`Select your ${option.text}`} onChange={onSelect}>
      {option.selections.map((selection, i) => (
        <Option value={selection.value} key={i}>{selection.text}</Option>
      ))}
    </Select>
  );
};

export default ConfigurableOption;
