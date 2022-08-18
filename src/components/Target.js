import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Permalink from './Permalink';

// Based on condition isValid, split array into two arrays: [[valid, invalid]]
const partition = (array, isValid) => {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
};

const DescriptionTerm = ({ children, html_id, ...rest }) => {
  return (
    <dt>
      {children.map((child, j) => (
        <ComponentFactory key={j} {...rest} nodeData={child} />
      ))}
      <Permalink id={html_id} description="definition" buffer="-150px" />
    </dt>
  );
};

DescriptionTerm.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  html_id: PropTypes.string.isRequired,
};

const Target = ({ nodeData: { children, html_id, name }, ...rest }) => {
  // If directive_argument node is not present, render an empty span with the target ID
  // Otherwise, render directive_argument as a dictionary node and attach the
  // ID to the description term field
  const [, dictList] = partition(children, (elem) => elem.type === 'target_identifier');
  const [[descriptionTerm], descriptionDetails] = partition(dictList, (elem) => elem.type === 'directive_argument');

  return (
    <React.Fragment>
      {/* Render binary and program targets as empty spans such that their IDs are rendered on the page. */}
      {dictList.length > 0 && !['binary', 'program'].includes(name) ? (
        <dl className={name}>
          {descriptionTerm && <DescriptionTerm {...rest} {...descriptionTerm} html_id={html_id} />}
          <dd>
            {descriptionDetails.map((node, i) => (
              <ComponentFactory {...rest} nodeData={node} key={i} />
            ))}
          </dd>
        </dl>
      ) : (
        <span className="header-buffer" id={html_id} />
      )}
    </React.Fragment>
  );
};

Target.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    html_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Target;
