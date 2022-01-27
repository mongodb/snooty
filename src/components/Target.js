import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ComponentFactory from './ComponentFactory';
import Permalink from './Permalink';
import { isBrowser } from '../utils/is-browser';
import useCopyClipboard from '../hooks/useCopyClipboard';

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
  const [copied, setCopied] = useState(false);
  const [headingNode, setHeadingNode] = useState(null);
  const url = isBrowser ? window.location.href.split('#')[0] + '#' + html_id : '';

  useCopyClipboard(copied, setCopied, headingNode, url);

  const handleClick = (e) => {
    setCopied(true);
  };

  return (
    <dt>
      {children.map((child, j) => (
        <ComponentFactory key={j} {...rest} nodeData={child} />
      ))}
      <Permalink copied={copied} setHeadingNode={setHeadingNode} id={html_id} handleClick={handleClick} />
      <HeaderBuffer id={html_id}></HeaderBuffer>
    </dt>
  );
};

const HeaderBuffer = styled.div`
  margin-top: -150px;
  position: absolute;
`;

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
        <span className="contains-headerlink" id={html_id} />
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
