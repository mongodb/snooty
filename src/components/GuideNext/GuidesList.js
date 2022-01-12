import React from 'react';
import styled from '@emotion/styled';
import GuidesListItem from './GuidesListItem';
import { getPlaintext } from '../../utils/get-plaintext';

const List = styled('ul')`
  list-style: none;
  padding-left: 0;
`;

const GuidesList = ({ guidesMetadata, guideSlugs, targetSlug }) => {
  return (
    <List>
      {guideSlugs.map((slug) => {
        const title = getPlaintext(guidesMetadata[slug].title);
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
