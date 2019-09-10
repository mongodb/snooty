import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { intersperse } from '../utils/intersperse';

const Footnote = ({ footnotes, nodeData: { children, id, name }, ...rest }) => {
  const footnoteReferences = footnotes[name] ? footnotes[name].references : [];
  const footnoteReferenceNodes = footnoteReferences.map((footnote, index) => (
    <a className="fn-backref" href={`#${footnote}`} key={footnote}>
      {index + 1}
    </a>
  ));
  return (
    <table className="docutils footnote" frame="void" id={id} rules="none">
      <colgroup>
        <col className="label" />
      </colgroup>
      <tbody valign="top">
        <tr>
          <td className="label">[{getNestedValue([name, 'label'], footnotes)}]</td>
          <td>
            <em>({intersperse(footnoteReferenceNodes)})</em>{' '}
            {children.map((child, index) => (
              <ComponentFactory {...rest} nodeData={child} key={index} parentNode="footnote" />
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Footnote.propTypes = {
  footnotes: PropTypes.objectOf(PropTypes.object).isRequired,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Footnote;
