import React, { useContext } from 'react';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getNestedValue } from '../../utils/get-nested-value';
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

type NodeData = {
  id: string;
  refname: string;
};

type FootnoteReferenceProps = {
  nodeData: NodeData;
};

type FootnotesContextType = {
  footnotes: Record<string, any>;
};

const FootnoteReference = ({ nodeData }: FootnoteReferenceProps) => {
  const { footnotes } = useContext(FootnoteContext) as FootnotesContextType;
  const { darkMode } = useDarkMode();

  const { id, refname } = nodeData;

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
