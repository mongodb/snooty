import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from './ComponentFactory';

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
    <dt id={html_id}>
      {children.map((child, j) => (
        <ComponentFactory key={j} {...rest} nodeData={child} />
      ))}
      <a href={`#${html_id}`} className="headerlink" title="Permalink to this definition">
        ¶
      </a>
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
  const [, dictList] = partition(children, elem => elem.type === 'target_identifier');
  const [[descriptionTerm], descriptionDetails] = partition(dictList, elem => elem.type === 'directive_argument');

  return (
    <React.Fragment>
      {dictList.length > 0 ? (
        <dl
          className={cx(
            name,
            ['binary', 'program'].includes(name)
              ? css`
                  /* Override dl.binary's display: none property in mongodb-docs.css */
                  /* Also hide program targets */
                  &,
                  & * {
                    display: inherit !important;
                    height: 0;
                    margin: 0;
                    padding: 0;
                    visibility: hidden;
                    width: 0;
                  }
                `
              : ''
          )}
        >
          {descriptionTerm && <DescriptionTerm {...rest} {...descriptionTerm} html_id={html_id} />}
          <dd>
            {descriptionDetails.map((node, i) => (
              <ComponentFactory {...rest} nodeData={node} key={i} />
            ))}
          </dd>
        </dl>
      ) : (
        <span id={html_id} />
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
