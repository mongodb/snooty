import React, { useContext } from 'react';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getNestedValue } from '../../utils/get-nested-value';
import { FootnoteReferenceNode } from '../../types/ast';
import FootnoteContext from './footnote-context';

const refStyles = css`
  color: ${palette.blue.light1};

  &:visited {
    color: ${palette.purple.base};
  }
`;

/**
 * Component used to show a clickable reference to footnote on page
 * scrolls to referenced element by id property
 */

export type FootnoteReferenceProps = {
  nodeData: FootnoteReferenceNode;
};

const FootnoteReference = ({ nodeData: { id, refname } }: FootnoteReferenceProps) => {
  const { footnotes } = useContext(FootnoteContext);
  const { darkMode } = useDarkMode();
  const ref = refname || id.replace('id', '');
  const uid = refname ? `${refname}-${id}` : id;

  return (
    <a
      className={cx('footnote-reference header-buffer', darkMode && refStyles)}
      href={`#footnote-${ref}`}
      id={`ref-${uid}`}
    >
      [{getNestedValue([ref, 'label'], footnotes) || ref}]
    </a>
  );
};

export default FootnoteReference;
