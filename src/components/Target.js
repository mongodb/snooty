import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

// Based on condition isValid, split array into two arrays: [[valid, invalid]]
const partition = (array, isValid) => {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
};

const TargetIdentifier = ({ nodeData: { ids } }) => (
  <React.Fragment>
    {ids.map((id, index) => (
      <span key={index} id={id} />
    ))}
  </React.Fragment>
);

TargetIdentifier.propTypes = {
  nodeData: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

const DescriptionTerm = ({ children, targetIdentifiers, ...rest }) => {
  const id = getNestedValue([0, 'ids', 0], targetIdentifiers);
  return (
    <dt id={id}>
      {children.map((child, j) => (
        <ComponentFactory key={j} {...rest} nodeData={child} />
      ))}
      <a href={`#${id}`} className="headerlink" title="Permalink to this definition">
        ¶
      </a>
    </dt>
  );
};

DescriptionTerm.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  targetIdentifiers: PropTypes.arrayOf(
    PropTypes.shape({
      ids: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

const Target = ({ nodeData: { children, name, target }, ...rest }) => {
  // If directive_argument node is not present, render target_identifiers as empty spans
  // Otherwise, render directive_argument as a dictionary node and attach the first
  // ID to the description term field
  const [targetIdentifiers, dictList] = partition(children, elem => elem.type === 'target_identifier');
  const [[descriptionTerm], descriptionDetails] = partition(dictList, elem => elem.type === 'directive_argument');

  return (
    <React.Fragment>
      {dictList.length > 0 ? (
        <dl className={name}>
          {descriptionTerm && <DescriptionTerm {...rest} {...descriptionTerm} targetIdentifiers={targetIdentifiers} />}
          <dd>
            {descriptionDetails.map((node, i) => (
              <ComponentFactory {...rest} nodeData={node} key={i} />
            ))}
          </dd>
        </dl>
      ) : (
        <React.Fragment>
          {targetIdentifiers.map((node, i) => (
            <TargetIdentifier key={i} nodeData={node} />
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

Target.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Target;
