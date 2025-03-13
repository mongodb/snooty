import React, { useCallback } from 'react';
import { Option, Select } from '@leafygreen-ui/select';
import { ComposableTutorialOption } from '../../types/ast';

interface ConfigurationOptionProps {
  option: ComposableTutorialOption;
  selections: { [key: string]: string };
  setCurrentSelections: React.Dispatch<{ [key: string]: string }>;
  showComposable: (dependencies: { [key: string]: string }[]) => boolean;
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
    <Select aria-labelledby={'null'} aria-label={`Select your ${option.text}`} onChange={onSelect}>
      {option.selections.map((selection) => (
        <Option value={selection.value}>{selection.text}</Option>
      ))}
    </Select>
  );
};

export default ConfigurableOption;
