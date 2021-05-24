import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';
import FootnoteContext from './footnote-context';
import StyledLink from './StyledLink';
import { theme } from '../theme/docsTheme';
import { getNestedValue } from '../utils/get-nested-value';
import { intersperse } from '../utils/intersperse';

const FootnoteContainer = styled((props) => <div {...props} />)`
  align-items: baseline;
  display: flex;
  margin: ${theme.size.medium} 0;

  :target {
    background-color: ${uiColors.yellow.light2};
  }
`;

const Label = styled('div')`
  flex-basis: 10%;
`;

const Content = styled('div')``;

const Footnote = ({ nodeData: { children, id, name }, ...rest }) => {
  const { footnotes } = useContext(FootnoteContext);
  const ref = name || id.replace('id', '');
  const label = getNestedValue([ref, 'label'], footnotes);
  const uid = name ? `${name}-` : '';
  const footnoteReferences = footnotes && footnotes[ref] ? footnotes[ref].references : [];
  const footnoteReferenceNodes = footnoteReferences.map((footnote, index) => (
    <StyledLink to={`#ref-${uid}${footnote}`} key={index}>
      {index + 1}
    </StyledLink>
  ));
  return (
    <FootnoteContainer id={`footnote-${ref}`}>
      <Label>
        [
        {footnoteReferenceNodes.length !== 1 ? (
          label
        ) : (
          <StyledLink to={`#ref-${uid}${footnoteReferences[0]}`}>{label}</StyledLink>
        )}
        ]
      </Label>
      <Content>
        {footnoteReferenceNodes.length > 1 && <em>({intersperse(footnoteReferenceNodes)})</em>}{' '}
        {children.map((child, index) => (
          <ComponentFactory {...rest} nodeData={child} key={index} parentNode="footnote" />
        ))}
      </Content>
    </FootnoteContainer>
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
