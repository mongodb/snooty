import React from 'react';
import styled from '@emotion/styled';
import GuidesListItem from './GuidesListItem';

const List = styled('ul')`
  list-style: none;
  padding-left: 0;
`;

export interface Guide {
  title: string;
  description: string;
  chapter_name?: string;
  completion_time?: number;
}

interface GuidesListProps {
  guidesMetadata: Record<string, Guide>;
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
