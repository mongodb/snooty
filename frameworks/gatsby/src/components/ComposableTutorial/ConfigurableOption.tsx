import React, { useMemo } from 'react';
import { Option, Select } from '@leafygreen-ui/select';
import { css, cx } from '@leafygreen-ui/emotion';
import { ComposableTutorialOption } from '../../types/ast';
import { theme } from '../../theme/docsTheme';
import { joinKeyValuesAsString } from './ComposableTutorial';

const selectStyling = css`
  flex: 1 1 200px;
  font-size: ${theme.fontSize.small};
  overflow: hidden;
  z-index: ${theme.zIndexes.actionBar};

  label,
  button {
    font-size: inherit;
  }

  label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  // for dark mode initial load
  > label {
    color: var(--font-color-primary);
  }

  .dark-theme & {
    > button {
      background-color: var(--gray-dark4);
      color: var(--gray-light3);
    }
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
  onSelect: (value: string, option: string, key: number) => void;
  precedingOptions: ComposableTutorialOption[];
  optionIndex: number;
}

const ConfigurableOption = ({
  option,
  selections,
  onSelect,
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

  return (
    <Select
      className={cx(selectStyling)}
      popoverZIndex={theme.zIndexes.actionBar - 1}
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
