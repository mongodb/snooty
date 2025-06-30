import React from 'react';
import { TocTreeEntry } from '../../types/ast';
import TOCNode from './TOCNode';

export type ToctreeProps = {
  toctree: TocTreeEntry;
  slug: string;
  handleClick: () => void;
};

const Toctree = ({ handleClick, slug, toctree: { children } }: ToctreeProps) => {
  return (
    <>
      {children.map((c, idx) => (
        <TOCNode key={idx} activeSection={slug} handleClick={handleClick} node={c} />
      ))}
    </>
  );
};

export default Toctree;
