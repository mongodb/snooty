import React, { useCallback, useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import FacetValue from './FacetValue';

// Facet options with the following ids will truncate the initial number of items shown
const TRUNCATE_OPTIONS = ['programming_language', 'sub_product'];
const TRUNCATE_AMOUNT = 5;

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

// Representative of a "facet-option" from search server response
const FacetGroup = ({ facetOption: { name, id, options }, isNested = false }) => {
  const shouldTruncate = options.length >= TRUNCATE_AMOUNT && TRUNCATE_OPTIONS.includes(id);
  const [truncated, setTruncated] = useState(shouldTruncate);
  const displayedOptions = truncated ? options.slice(0, TRUNCATE_AMOUNT) : options;
  const truncatedState = truncated
    ? {
        glyph: 'ChevronDown',
        text: 'Show more',
      }
    : {
        glyph: 'ChevronUp',
        text: 'Show less',
      };

  const handleExpansionClick = useCallback(() => {
    setTruncated((prev) => !prev);
  }, []);

  return (
    <div className={cx(optionStyle(isNested))}>
      {!isNested && <Body className={cx(optionNameStyle)}>{name}</Body>}
      {displayedOptions.map((facet) => {
        return <FacetValue key={facet.id} facetValue={facet} isNested={isNested} />;
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
