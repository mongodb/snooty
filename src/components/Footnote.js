import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Footnote = ({ nodeData, nodeData: { children, id, label }, ...rest }) => {
  return (
    <table className="docutils footnote" frame="void" id={id} rules="none">
      <colgroup>
        <col className="label" />
      </colgroup>
      <tbody valign="top">
        <tr>
          <td className="label">[{label}]</td>
          <td>
            <em />{' '}
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
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default Footnote;
