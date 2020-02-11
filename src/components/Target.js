import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Target = ({ nodeData: { children, name, target } }) => {
  // Identify special child nodes (target_ref_title and directive_argument) and render properly.
  // Render the remaining children nodes as standard children.
  const childNodes = [];
  let targetRefTitle,
    directiveArgument = null;
  children.forEach(node => {
    if (node.type === 'target_ref_title') {
      targetRefTitle = <span id={target} />;
    } else if (node.type === 'directive_argument') {
      directiveArgument = (
        <dt id={target}>
          {node.children.map((child, j) => (
            <ComponentFactory key={j} nodeData={child} />
          ))}
          <a href={`#${target}`} className="headerlink" title="Permalink to this definition">
            ¶
          </a>
        </dt>
      );
    } else {
      childNodes.push(node);
    }
  });

  const renderDictList = directiveArgument || childNodes.length > 0;
  return (
    <React.Fragment>
      {targetRefTitle}
      {renderDictList && (
        <dl className={name}>
          {directiveArgument}
          {childNodes.length > 0 && (
            <dd>
              {children.map((node, i) => (
                <ComponentFactory nodeData={node} key={i} />
              ))}
            </dd>
          )}
        </dl>
      )}
    </React.Fragment>
  );
};

Target.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default Target;
