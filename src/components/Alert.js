import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { makeId } from '../utils/make-id';

const Alert = ({ nodeData, ...rest }) => {
  const alertTitle = getNestedValue(['argument', 0, 'value'], nodeData);
  return (
    <dl className="alert">
      <dt id={makeId(alertTitle)}>
        <code className="descname">{alertTitle}</code>
        <a className="headerlink" href={`#${makeId(alertTitle)}`} title="Permalink to this definition">
          ¶
        </a>
      </dt>
      <dd>
        {nodeData.children.map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </dd>
    </dl>
  );
};

export default Alert;
