import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import FootnoteContext from './footnote-context';
import ComponentFactory from '../ComponentFactory';
import { getNestedValue } from '../../utils/get-nested-value';
import { intersperse } from '../../utils/intersperse';

const tableStyling = css`
  border: 0;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 14px;
  line-height: 24px;

  tbody tr td div.highlight pre {
    background-color: inherit;
  }

  :target {
    background-color: #ffa;
  }
`;

const tdStyling = css`
  border: 0;
  padding: 11px 5px 12px;
`;

const Footnote = ({ nodeData: { children, id, name }, ...rest }) => {
  const { footnotes } = useContext(FootnoteContext);
  const ref = name || id.replace('id', '');
  const label = getNestedValue([ref, 'label'], footnotes);
  const uid = name ? `${name}-` : '';
  const footnoteReferences = footnotes && footnotes[ref] ? footnotes[ref].references : [];
  const footnoteReferenceNodes = footnoteReferences.map((footnote, index) => (
    <a href={`#ref-${uid}${footnote}`} key={index}>
      {index + 1}
    </a>
  ));
  return (
    <table className="header-buffer" css={tableStyling} frame="void" id={`footnote-${ref}`} rules="none">
      <colgroup>
        <col />
      </colgroup>
      <tbody valign="top">
        <tr>
          <td css={tdStyling}>
            [{footnoteReferenceNodes.length !== 1 ? label : <a href={`#ref-${uid}${footnoteReferences[0]}`}>{label}</a>}
            ]
          </td>
          <td css={tdStyling}>
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
