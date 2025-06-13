import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { ListNode } from '../../types/ast';

const enumtypeMap = {
  arabic: '1',
  loweralpha: 'a',
  upperalpha: 'A',
  lowerroman: 'i',
  upperroman: 'I',
};

type EnumTypeKey = keyof typeof enumtypeMap;

const listStyles = css`
  margin-top: 0px;
`;

export type ListProps = {
  nodeData: ListNode;
};

const List = ({ nodeData: { children, enumtype, startat }, ...rest }: ListProps) => {
  const ListTag = enumtype === 'unordered' ? 'ul' : 'ol';

  const typeAttr = enumtype && enumtype in enumtypeMap ? enumtypeMap[enumtype as EnumTypeKey] : undefined;
  const startAttr = startat ?? undefined;

  return (
    <ListTag
      className={cx(listStyles)}
      {...(typeAttr ? { type: typeAttr as '1' | 'a' | 'A' | 'i' | 'I' } : {})}
      {...(startAttr !== undefined ? { start: startAttr } : {})}
    >
      {children.map((listChild, index) => (
        <ComponentFactory {...rest} nodeData={listChild} key={index} />
      ))}
    </ListTag>
  );
};

export default List;
