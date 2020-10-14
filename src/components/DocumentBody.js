import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import FootnoteContext from '../components/footnote-context';
import { getNestedValue } from '../utils/get-nested-value';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';

// Modify the AST so that the node modified by cssclass is included in its "children" array.
// Delete this modified node from its original location.
const normalizeCssClassNodes = (nodes, key, value) => {
  const searchNode = (node, i, arr) => {
    // If a cssclass node has no children, add the proceeding node to its array of children,
    // thereby appending the specified class to that component.
    if (node[key] === value && i < arr.length - 1 && node.children.length === 0) {
      const nextNode = arr[i + 1];
      node.children.push(nextNode);
      arr.splice(i + 1, 1);
    }
    if (node.children) {
      node.children.forEach(searchNode);
    }
  };
  nodes.forEach(searchNode);
};

// Identify the footnotes on a page and all footnote_reference nodes that refer to them.
// Returns a map wherein each key is the footnote name, and each value is an object containing:
// - labels: the numerical label for the footnote
// - references: a list of the footnote reference ids that refer to this footnote
const getFootnotes = nodes => {
  const footnotes = findAllKeyValuePairs(nodes, 'type', 'footnote');
  const footnoteReferences = findAllKeyValuePairs(nodes, 'type', 'footnote_reference');
  // We label our footnotes by their index, regardless of their names to
  // circumvent cases such as [[1], [#], [2], ...]
  return footnotes.reduce((map, footnote, index) => {
    if (footnote.name) {
      // Find references associated with a named footnote
      // eslint-disable-next-line no-param-reassign
      map[footnote.name] = {
        label: index + 1,
        references: getNamedFootnoteReferences(footnoteReferences, footnote.name),
      };
    } else {
      // Find references associated with an anonymous footnote
      // Replace potentially broken anonymous footnote ids
      footnote.id = `${index + 1}`;
      // eslint-disable-next-line no-param-reassign
      map[footnote.id] = {
        label: index + 1,
        references: [getAnonymousFootnoteReferences(index)],
      };
    }
    return map;
  }, {});
};

// Find all footnote_reference node IDs associated with a given footnote by
// that footnote's refname
const getNamedFootnoteReferences = (footnoteReferences, refname) => {
  return footnoteReferences.filter(node => node.refname === refname).map(node => node.id);
};

// They are used infrequently, but here we match an anonymous footnote to its reference.
// The nth footnote on a page is associated with the nth reference on the page. Since
// anon footnotes and footnote references are anonymous, we assume a 1:1 pairing, and
// have no need to query nodes
const getAnonymousFootnoteReferences = index => {
  return `id${index + 1}`;
};

export default class DocumentBody extends Component {
  constructor(props) {
    super(props);
    const { pageContext } = this.props;
    this.pageNodes = getNestedValue(['page', 'ast', 'children'], pageContext) || [];
    // Standardize cssclass nodes that appear on the page
    normalizeCssClassNodes(this.pageNodes, 'name', 'cssclass');
    this.footnotes = getFootnotes(this.pageNodes);
  }

  render() {
    const {
      pageContext: { metadata, page, slug },
    } = this.props;
    return (
      <FootnoteContext.Provider value={{ footnotes: this.footnotes }}>
        {this.pageNodes.map((child, index) => (
          <ComponentFactory key={index} metadata={metadata} nodeData={child} page={page} slug={slug} />
        ))}
      </FootnoteContext.Provider>
    );
  }
}

DocumentBody.propTypes = {
  pageContext: PropTypes.shape({
    metadata: PropTypes.object.isRequired,
    page: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    slug: PropTypes.string.isRequired,
  }),
};
