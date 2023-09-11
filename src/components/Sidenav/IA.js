import React from 'react';
import PropTypes from 'prop-types';
import { SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { cx, css } from '@leafygreen-ui/emotion';
import Link from '../Link';
import { formatText } from '../../utils/format-text';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { sideNavItemBasePadding, sideNavItemFontSize } from './styles/sideNavItem';
import IALinkedData from './IALinkedData';

const headerPadding = css`
  > div {
    ${sideNavItemBasePadding}
  }
`;

const fontStyling = css`
  line-height: 20px;
`;

/**
 * Traverses the IA tree to look for nodes with IDs and linked data.
 * @param {*} iaTreeNode
 * @param {*} mapping
 */
const traverseIATree = (iaTreeNode, mapping) => {
  if (!iaTreeNode) {
    return;
  }

  if (iaTreeNode.id && iaTreeNode.linked_data) {
    mapping[iaTreeNode.id] = iaTreeNode.linked_data;
  }

  if (iaTreeNode.children?.length) {
    iaTreeNode.children.forEach((node) => {
      traverseIATree(node, mapping);
    });
  }
};

/**
 * Finds IA linked data across the IA tree.
 * @param {*} iaTree
 */
const findIALinkedData = (iaTree) => {
  const mapping = {};
  traverseIATree(iaTree, mapping);
  return mapping;
};

const IA = ({ handleClick, header, ia }) => {
  const { iatree } = useSnootyMetadata();
  const linkedDataMapping = findIALinkedData(iatree);

  return (
    <SideNavGroup className={cx(headerPadding)} header={header}>
      {ia.map(({ title, slug, url, id }, index) => {
        const target = slug || url;
        // We use the linked data from the mapping since the linked data and the
        // IA entry might not always be on the same page (such as the "/search" page).
        const linkedData = linkedDataMapping[id];
        return (
          <React.Fragment key={index}>
            <SideNavItem
              className={cx([sideNavItemBasePadding, sideNavItemFontSize, fontStyling])}
              key={target}
              as={Link}
              onClick={handleClick}
              to={target}
            >
              {formatText(title)}
            </SideNavItem>
            {linkedData && <IALinkedData linkedData={linkedData} />}
          </React.Fragment>
        );
      })}
    </SideNavGroup>
  );
};

IA.propTypes = {
  handleClick: PropTypes.func,
  header: PropTypes.element,
  ia: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.arrayOf(PropTypes.object),
      slug: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default IA;
