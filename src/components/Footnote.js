import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { intersperse } from '../utils/intersperse';
import FootnoteContext from './footnote-context';

const Footnote = ({ nodeData: { children, id, name }, ...rest }) => {
  const { footnotes } = useContext(FootnoteContext);
  const ref = name || id.replace('id', '');
  const footnoteReferences = footnotes[ref] ? footnotes[ref].references : [];
  const footnoteReferenceNodes = footnoteReferences.map(_ => (
    <a className="fn-backref" href={`#footnote-ref-${ref}`} id={`footnote-${ref}`}>
      {getNestedValue([ref, 'label'], footnotes)}
    </a>
  ));
  return (
    <table className="docutils footnote" frame="void" id={id} rules="none">
      <colgroup>
        <col className="label" />
      </colgroup>
      <tbody valign="top">
        <tr>
          <td className="label">[{intersperse(footnoteReferenceNodes)}]</td>
          <td>
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
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default Footnote;
