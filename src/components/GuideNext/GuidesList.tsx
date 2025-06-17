import React from 'react';
import styled from '@emotion/styled';
import type { MetadataGuides } from '../../types/data';
import GuidesListItem from './GuidesListItem';

const List = styled('ul')`
  list-style: none;
  padding-left: 0;
`;

interface GuidesListProps {
  guidesMetadata: MetadataGuides;
  guideSlugs: Array<string>;
  targetSlug: string;
}

const GuidesList = ({ guidesMetadata, guideSlugs, targetSlug }: GuidesListProps) => {
  return (
    <List>
      {guideSlugs.map((slug) => {
        return (
          <GuidesListItem key={slug} isNext={targetSlug === slug} slug={slug}>
            {guidesMetadata[slug].title}
          </GuidesListItem>
        );
      })}
    </List>
  );
};

export default GuidesList;
