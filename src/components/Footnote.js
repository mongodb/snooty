import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';
import { intersperse } from '../utils/intersperse';
import FootnoteContext from './footnote-context';

const Footnote = ({ nodeData: { children, id, name }, ...rest }) => {
  const { footnotes } = useContext(FootnoteContext);
  const ref = name || id.replace('id', '');
  const label = getNestedValue([ref, 'label'], footnotes);
  const footnoteReferences = footnotes[ref] ? footnotes[ref].references : [];
  const footnoteReferenceNodes = footnoteReferences.map((footnote, index) => (
    <a className="fn-backref" href={`#ref-${footnote}`}>
      {index + 1}
    </a>
  ));
  return (
    <table className="docutils footnote" frame="void" id={ref} rules="none">
      <colgroup>
        <col className="label" />
      </colgroup>
      <tbody valign="top">
        <tr>
          <td className="label">
            [
            {footnoteReferenceNodes.length > 1 ? (
              label
            ) : (
              <a className="fn-backref" href={`#ref-${footnoteReferences[0]}`}>
                {label}
              </a>
            )}
            ]
          </td>
          <td>
            {footnoteReferenceNodes.length > 1 && <em>({intersperse(footnoteReferenceNodes)})</em>}{' '}
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
