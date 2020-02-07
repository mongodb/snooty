import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Target = ({ nodeData }) => {
  console.log(nodeData);
  const { children, name, target } = nodeData;
  return (
    <React.Fragment>
      {children.map((node, i) => {
        if (node.type === 'target_ref_title') {
          return null;
        } else if (node.type === 'directive_argument') {
          console.log('JHIIIASDIFJ');
          console.log(node);
          return (
            <dl className={name}>
              <dt id={target}>
                {node.children.map((child, j) => (
                  <ComponentFactory key={j} nodeData={child} />
                ))}
                <a href={`#${target}`} className="headerlink" title="Permalink to this definition">
                  ¶
                </a>
              </dt>
            </dl>
          );
        } else {
          console.log('HIIIIIIIIIII');
          return <h3>children</h3>;
        }
      })}
    </React.Fragment>
  );
};

export default Target;
