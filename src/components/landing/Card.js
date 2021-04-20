import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import Box from '@leafygreen-ui/box';
import LeafyGreenCard from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import Link from '../Link';
import Tag from '../Tag';

const StyledCard = styled(LeafyGreenCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.size.large};
`;

const CardIcon = styled('img')`
  width: ${theme.size.medium};
`;

const CompactCard = styled(LeafyGreenCard)`
  border-radius: ${theme.size.tiny};
  box-shadow: 0px 0px ${theme.size.tiny} ${uiColors.gray.light2};
  display: grid;
  grid-template-columns: 48px auto;
  column-gap: 0px};
  margin: auto;
  max-width: 500px;
  padding: ${theme.size.large} ${theme.size.medium};
  @media ${theme.screenSize.upToSmall} {
    grid-template-columns: 40px auto;
  }
`;

const CompactIcon = styled('img')`
  display: block;
  margin: auto;
  width: ${theme.size.medium};
  @media ${theme.screenSize.upToSmall} {
    width: 20px;
  }
`;

const CompactIconCircle = styled('div')`
  display: flex;
  justify-content: center;
  grid-column: 1;
  background: ${uiColors.green.light3};
  height: 48px;
  width: 48px;
  border-radius: 50%;
  @media ${theme.screenSize.upToSmall} {
    height: 40px;
    width: 40px;
  }
`;

const CompactCardText = styled('div')`
  grid-column: 2;
  margin-left: ${theme.size.medium};
  a {
    font-size: ${theme.fontSize.default};
  }
  p {
    color: ${uiColors.gray.dark3};
    margin-bottom: ${theme.size.default};
  }
`;

const H4 = styled('h4')`
  letter-spacing: 0.5px;
  margin: ${theme.size.medium} 0 ${theme.size.small} 0;
`;

const CTA = styled(Link)`
  font-weight: bold;
  margin-top: auto;
  margin-bottom: 0;
`;

const FlexTag = styled(Tag)`
  margin-right: auto;
`;

const Card = ({
  nodeData: {
    children,
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
  style,
  page,
}) => {
  const isCompact = style === 'compact';
  console.log(isCompact);
  return (
    <Box href={url}>
      <>
        {isCompact ? (
          <CompactCard>
            {icon && (
              <CompactIconCircle>
                <CompactIcon src={withPrefix(icon)} alt={iconAlt} />
              </CompactIconCircle>
            )}
            <CompactCardText>
              {children.map((child, i) => (
                <ComponentFactory nodeData={child} key={i} />
              ))}
              <CTA to={url}>{cta}</CTA>
            </CompactCardText>
          </CompactCard>
        ) : (
          <StyledCard>
            {icon && <CardIcon src={withPrefix(icon)} alt={iconAlt} />}
            {tag && <FlexTag text={tag} />}
            <H4>{headline}</H4>
            {children.map((child, i) => (
              <ComponentFactory nodeData={child} key={i} />
            ))}
            <CTA to={url}>{cta}</CTA>
          </StyledCard>
        )}
      </>
    </Box>
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
