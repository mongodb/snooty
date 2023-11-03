import React, { useCallback, useMemo, useState, useContext } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import Select from '../../Select';
import SearchContext from '../SearchContext';
import { theme } from '../../../theme/docsTheme';
import FacetValue, { initChecked } from './FacetValue';

// Facet options with the following ids will truncate the initial number of items shown
const TRUNCATE_OPTIONS = ['programming_language', 'sub_product'];
const TRUNCATE_AMOUNT = 5;

export const VERSION_GROUP_ID = 'version';

const optionStyle = (isNested) => css`
  ${isNested
    ? `
    margin-left: 22px;
  `
    : `
    margin-bottom: 36px;
  `}
`;

const optionNameStyle = css`
  margin-bottom: 8px;
  font-weight: 600;
`;

const showMoreStyle = css`
  display: flex;
  align-items: center;
  gap: 0 8px;
  font-size: 13px;
  line-height: 20px;
  color: ${palette.gray.dark4};
  margin-bottom: 16px;
  cursor: pointer;
`;

const showMoreGlyphStyle = css`
  color: ${palette.gray.dark2};
`;

// TODO: move to new file

const selectStyle = css`
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  margin-bottom: 8px;
  padding-left: 22px;

  button {
    height: 22px;
  }
`;

const FacetVersionGroup = ({ facetOption: { name, id, options } }) => {
  // create select options from options
  const selectOptions = useMemo(
    () => options.map((option) => ({ text: option.name, value: option.id, key: option.key })),
    [options]
  );
  const { handleFacetChange, searchParams } = useContext(SearchContext);

  const [value, setValue] = useState(
    () => selectOptions.find(({ key, value }) => initChecked(searchParams, key, value))?.value || selectOptions[0].value
  );

  const optionsById = useMemo(
    () =>
      options.reduce((map, option) => {
        map[option.id] = option;
        return map;
      }, {}),
    [options]
  );

  const onChange = useCallback(
    (newOption) => {
      const selectedOption = optionsById[newOption.value];
      const oldSelection = optionsById[value];
      const facetsToUpdate = [];

      // update to unselect current selection
      facetsToUpdate.push({
        key: oldSelection.key,
        id: oldSelection.id,
        checked: false,
      });

      // update to select new selection
      facetsToUpdate.push({
        key: selectedOption.key,
        id: selectedOption.id,
        checked: true,
      });

      setValue(selectedOption.id);
      handleFacetChange(facetsToUpdate);
    },
    [handleFacetChange, optionsById, value]
  );

  return <Select className={cx(selectStyle)} value={value} choices={selectOptions} onChange={onChange}></Select>;
};

// END TODO: move to new file

// Representative of a "facet-option" from search server response
const FacetGroup = ({ facetOption: { name, id, options }, isNested = false, numSelectedChildren }) => {
  const shouldTruncate = options.length >= TRUNCATE_AMOUNT && TRUNCATE_OPTIONS.includes(id);
  const [truncated, setTruncated] = useState(shouldTruncate);
  const displayedOptions = truncated ? options.slice(0, TRUNCATE_AMOUNT) : options;
  const selfAndSiblings = isNested ? options : null;
  const truncatedState = truncated
    ? {
        glyph: 'ChevronDown',
        text: 'Show more',
      }
    : {
        glyph: 'ChevronUp',
        text: 'Show less',
      };
  const siblingsSelected = numSelectedChildren > 1;
  const handleExpansionClick = useCallback(() => {
    setTruncated((prev) => !prev);
  }, []);

  if (id === VERSION_GROUP_ID) {
    return <FacetVersionGroup facetOption={{ name, id, options }} />;
  }

  return (
    <div className={cx(optionStyle(isNested))}>
      {!isNested && <Body className={cx(optionNameStyle)}>{name}</Body>}
      {displayedOptions.map((facet) => {
        return (
          <FacetValue
            key={facet.id}
            facetValue={facet}
            isNested={isNested}
            siblingsSelected={siblingsSelected}
            selfAndSiblings={selfAndSiblings}
          />
        );
      })}
      {shouldTruncate && (
        <div className={cx(showMoreStyle)} onClick={handleExpansionClick}>
          <Icon className={cx(showMoreGlyphStyle)} glyph={truncatedState.glyph} />
          {truncatedState.text}
        </div>
      )}
    </div>
  );
};

export default FacetGroup;
