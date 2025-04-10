import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getPlaintext } from '../../utils/get-plaintext';
import GuidesListItem from './GuidesListItem';

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

GuidesList.propTypes = {
  guidesMetadata: PropTypes.object.isRequired,
  guideSlugs: PropTypes.array.isRequired,
  targetSlug: PropTypes.string,
};

export default GuidesList;
