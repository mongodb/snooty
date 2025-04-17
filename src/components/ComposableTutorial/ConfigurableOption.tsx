import React, { useMemo } from 'react';
import { Option, Select } from '@leafygreen-ui/select';
import { css, cx } from '@leafygreen-ui/emotion';
import { ComposableTutorialOption } from '../../types/ast';
import { theme } from '../../theme/docsTheme';
import { joinKeyValuesAsString } from './ComposableTutorial';

const selectStyling = css`
  flex: 1 0 auto;
  font-size: ${theme.fontSize.small};
  overflow: hidden;

  label,
  button {
    font-size: inherit;
  }

  label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  @media ${theme.screenSize.upToMedium} {
    flex: 0 1 calc(50% - ${theme.size.small});
  }
`;

const optionStyling = css`
  font-size: ${theme.fontSize.small};
`;

interface ConfigurationOptionProps {
  validSelections: Set<string>;
  option: ComposableTutorialOption;
  selections: Record<string, string>;
  showComposable: (dependencies: Record<string, string>[]) => boolean;
  onSelect: (value: string, option: string, key: number) => void;
  precedingOptions: ComposableTutorialOption[];
  optionIndex: number;
}

const ConfigurableOption = ({
  option,
  selections,
  onSelect,
  showComposable,
  validSelections,
  precedingOptions,
  optionIndex,
}: ConfigurationOptionProps) => {
  const filteredOptions = useMemo(() => {
    return option.selections.filter((selection) => {
      // find a validSelection whilst replacing the current configurable option with each options value
      // if its valid, option is valid
      const precedingSelections: Record<string, string> = {};
      for (const precedingOption of precedingOptions) {
        if (selections[precedingOption.value]) {
          precedingSelections[precedingOption.value] = selections[precedingOption.value];
        }
      }
      const targetObj = { ...precedingSelections, [option.value]: selection.value };
      const targetString = joinKeyValuesAsString(targetObj);

      return validSelections.has(targetString);
    });
  }, [option, precedingOptions, selections, validSelections]);

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
      onChange={(value) => onSelect(value, option.value, optionIndex)}
    >
      {filteredOptions.map((selection, i) => (
        <Option className={optionStyling} value={selection.value} key={i}>
          {selection.text}
        </Option>
      ))}
    </Select>
  );
};

export default ConfigurableOption;
