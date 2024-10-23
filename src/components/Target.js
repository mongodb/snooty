import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { cx, css } from '@leafygreen-ui/emotion';
import useHashAnchor from '../hooks/use-hash-anchor';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';
import Permalink from './Permalink';

const headerBuffer = css`
  scroll-margin-top: ${theme.header.navbarScrollOffset};
  position: absolute;
`;

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
      <Permalink id={html_id} description="definition" />
    </dt>
  );
};

DescriptionTerm.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  html_id: PropTypes.string.isRequired,
};

const Target = ({ nodeData: { children, html_id, name, options }, ...rest }) => {
  // If directive_argument node is not present, render an empty span with the target ID
  // Otherwise, render directive_argument as a dictionary node and attach the
  // ID to the description term field
  const [, dictList] = partition(children, (elem) => elem.type === 'target_identifier');
  const [[descriptionTerm], descriptionDetails] = partition(dictList, (elem) => elem.type === 'directive_argument');
  const hidden = options && options.hidden ? true : false;
  const targetRef = useRef();
  useHashAnchor(html_id, targetRef);

  return (
    <React.Fragment>
      {/* Render binary and program targets **and targets with the :hidden: flag
      as empty spans such that their IDs are rendered on the page. */}
      {dictList.length > 0 && !['binary', 'program'].includes(name) && !hidden ? (
        <dl className={name}>
          {descriptionTerm && <DescriptionTerm {...rest} {...descriptionTerm} html_id={html_id} />}
          <dd>
            {descriptionDetails.map((node, i) => (
              <ComponentFactory {...rest} nodeData={node} key={i} />
            ))}
          </dd>
        </dl>
      ) : (
        <span ref={targetRef} className={cx(headerBuffer)} id={html_id} />
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
