import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import CSSWrapper from './CSSWrapper';
import { getNestedValue } from '../utils/get-nested-value';
import { makeId } from '../utils/make-id';

// The classname associated with each admonition is illogical, so map them statically here
const CLASSNAME_MAP = {
  admonition: '',
  example: 'admonition-example',
  important: 'important',
  note: 'note',
  seealso: 'seealso',
  tip: 'admonition-tip',
  warning: 'warning',
};

const Admonition = ({ nodeData, ...rest }) => {
  const { name } = nodeData;

  // If an admonition's contents are written on the same line as the directive in the rST, they will appear as node arguments.
  // In this case, the admonition has no defined title, and we need to treat the argument property as the node's children.
  const hasChildren = nodeData.children.length > 0;
  const childElements = hasChildren ? nodeData.children : nodeData.argument;
  let titleText;
  if (hasChildren) {
    titleText = getNestedValue(['argument', 0, 'value'], nodeData);
  }
  return (
    <div
      className={[
        'admonition',
        CLASSNAME_MAP[name],
        getNestedValue(['options', 'class'], nodeData),
        titleText ? `admonition-${makeId(titleText)}` : null, // stringify title into slug
      ].join(' ')}
    >
      <p className="first admonition-title">{titleText || name}</p>
      {childElements.map((child, index) => {
        // Apply "last" class to the last child element of admonition
        if (index === nodeData.children.length - 1) {
          return (
            <CSSWrapper key={index} className="last">
              <ComponentFactory {...rest} parentNode={null} nodeData={child} />
            </CSSWrapper>
          );
        }
        return <ComponentFactory {...rest} nodeData={child} key={index} />;
      })}
    </div>
  );
};

Admonition.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Admonition;
