import React from 'react';
import styled from '@emotion/styled';
import type { MetadataGuides } from '../../types/data';
import { getPlaintext } from '../../utils/get-plaintext';
import GuidesListItem from './GuidesListItem';

const List = styled('ul')`
  list-style: none;
  padding-left: 0;
`;

interface GuidesListProps {
  guidesMetadata: MetadataGuides;
  guideSlugs: Array<string>;
  targetSlug?: string | null;
}

const GuidesList = ({ guidesMetadata, guideSlugs, targetSlug }: GuidesListProps) => {
  return (
    <List>
      {guideSlugs.map((slug) => {
        let title = guidesMetadata[slug].title;
        if (typeof title !== 'string') {
          title = getPlaintext(title);
        }

        return (
          <GuidesListItem key={slug} isNext={targetSlug === slug} slug={slug}>
            {title}
          </GuidesListItem>
        );
      })}
    </List>
  );
};

export default GuidesList;
