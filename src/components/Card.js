import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';
import ConditionalWrapper from './ConditionalWrapper';
import Link from './Link';
import Tag from './Tag';

const StyledCard = styled(LeafyGreenCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.size.large};

  p:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: ${({ url }) => (url ? `` : `0 4px 10px -4px rgba(6,22,33,0.3)`)};
  }
`;

const CardIcon = styled('img')`
  width: ${theme.size.medium};
`;

// Applied when no URL option is specified for the card, because the card-ref
// and ref directives are currently indistinguishable in the AST
const cardRefStyling = css`
  a {
    background: ${uiColors.gray.light3};
    border-radius: ${theme.size.tiny};
    border: 1px solid rgba(184, 196, 194, 0.48);
    box-sizing: border-box;
    display: inline-block;
    font-size: ${theme.fontSize.small} !important;
    font-weight: 600;
    margin-bottom: ${theme.size.tiny};
    margin-right: ${theme.size.tiny};
    padding: ${theme.size.tiny};

    &:after {
      content: ' ➔';
    }
  }
`;

const H4 = styled('h4')`
  letter-spacing: 0.5px;
  margin: ${({ compact, theme }) =>
    compact ? `0 0 ${theme.size.small}` : `${theme.size.medium} 0 ${theme.size.small} 0`};
`;

const CTA = styled('p')`
  font-weight: bold;
  margin-top: ${theme.size.small};
  & > a:hover {
    color: ${uiColors.blue.dark2};
  }
`;

const FlexTag = styled(Tag)`
  margin-right: auto;
`;

const CompactCard = styled(StyledCard)`
  align-items: flex-start;
  flex-direction: row;
  padding: ${theme.size.large} ${theme.size.medium};
`;

const CompactIcon = styled('img')`
  margin: auto;
  width: ${theme.size.medium};
  @media ${theme.screenSize.upToSmall} {
    width: 20px;
  }
`;

const CompactIconCircle = styled('div')`
  background: ${uiColors.green.light3};
  border-radius: 50%;
  display: flex;
  flex-shrink: 0 !important;
  height: 48px;
  width: 48px;
  @media ${theme.screenSize.upToSmall} {
    height: 40px;
    width: 40px;
  }
`;

const CompactTextWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: ${theme.size.medium};
  @media ${theme.screenSize.upToSmall} {
    margin-left: ${theme.size.default};
  }
`;

const Card = ({
  isCompact,
  isExtraCompact,
  nodeData: {
    children,
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
}) => {
  const Card = isCompact || isExtraCompact ? CompactCard : StyledCard;
  const Icon = isCompact ? CompactIcon : CardIcon;
  return (
    <Card
      onClick={
        url
          ? () => {
              window.location.href = url;
            }
          : undefined
      }
    >
      {icon && (
        <ConditionalWrapper
          condition={isCompact}
          wrapper={(children) => <CompactIconCircle>{children}</CompactIconCircle>}
        >
          <Icon src={withPrefix(icon)} alt={iconAlt} />
        </ConditionalWrapper>
      )}
      <ConditionalWrapper
        condition={isCompact || isExtraCompact}
        wrapper={(children) => (
          <CompactTextWrapper className={!url && cx(cardRefStyling)}>{children}</CompactTextWrapper>
        )}
      >
        {tag && <FlexTag text={tag} />}
        <H4 compact={isCompact || isExtraCompact}>{headline}</H4>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
        {cta && (
          <CTA>
            <Link to={url}>{cta}</Link>
          </CTA>
        )}
      </ConditionalWrapper>
    </Card>
  );
};

Card.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      cta: PropTypes.string,
      headline: PropTypes.string,
      icon: PropTypes.string,
      'icon-alt': PropTypes.string,
      tag: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
};

export default Card;
