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
  ${!isNested && 'margin-bottom: 36px;'}
`;

const optionNameStyle = css`
  margin-bottom: 8px;
`;

const showMoreStyle = css`
  display: flex;
  align-items: center;
  gap: 0 8px;
  font-size: 13px;
  line-height: 20px;
  color: ${palette.gray.dark4};
  margin: 8px 0;
  cursor: pointer;
`;

const showMoreGlyphStyle = css`
  color: ${palette.gray.dark2};
`;

const FacetOption = ({ className, facetOption: { name, id, options }, isNested = false }) => {
  const [truncated, setTruncated] = useState(TRUNCATE_OPTIONS.includes(id));
  const displayedOptions = truncated ? options.slice(0, TRUNCATE_AMOUNT) : options;

  const handleExpandResults = useCallback(() => {
    setTruncated(false);
  }, []);

  return (
    <div className={cx(optionStyle(isNested), className)}>
      {!isNested && <Body className={cx(optionNameStyle)} weight={'bold'}>{name}</Body>}
      {displayedOptions.map((facet) => {
        return <FacetValue key={facet.id} facetValue={facet} />;
      })}
      {truncated && (
        <div className={cx(showMoreStyle)} onClick={handleExpandResults}>
          <Icon className={cx(showMoreGlyphStyle)} glyph={'ChevronDown'} />
          Show more
        </div>
      )}
    </div>
  );
};

export default FacetOption;
