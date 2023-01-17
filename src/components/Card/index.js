import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix, navigate } from 'gatsby';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import ConditionalWrapper from '../ConditionalWrapper';
import Link from '../Link';
import Tag from '../Tag';
import { isRelativeUrl } from '../../utils/is-relative-url';

const cardStyling = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.size.large};

  p:last-of-type {
    margin-bottom: 0;
  }
`;

const CardIcon = styled('img')`
  width: ${theme.size.large};
`;

const CompactIcon = styled('img')`
  width: ${theme.size.medium};
  @media ${theme.screenSize.upToSmall} {
    width: 20px;
  }
`;

const headingStyling = ({ isCompact, isExtraCompact }) => css`
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: ${isCompact || isExtraCompact ? `0 0 ${theme.size.small}` : `${theme.size.default} 0 ${theme.size.small} 0`};
`;

const FlexTag = styled(Tag)`
  margin-right: auto;
`;

const compactCardStyling = css`
  align-items: flex-start;
  flex-direction: row;
  padding: ${theme.size.large} ${theme.size.medium};
`;

const CompactTextWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: ${theme.size.small};
  @media ${theme.screenSize.upToSmall} {
    margin-left: ${theme.size.default};
  }

  p {
    line-height: ${theme.size.medium};
  }
`;

const bodyStyling = css`
  a {
    line-height: unset;
  }
`;

const onCardClick = (url) => {
  isRelativeUrl(url) ? navigate(url) : (window.location.href = url);
};

const Card = ({
  isCompact,
  isExtraCompact,
  page,
  nodeData: {
    children,
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
}) => {
  const styling = [cardStyling, isCompact || isExtraCompact ? compactCardStyling : ''];
  const template = page?.options?.template;
  const Icon = ['landing', 'product-landing'].includes(template) ? CardIcon : CompactIcon;

  return (
    <LeafyGreenCard className={cx(styling)} onClick={url ? () => onCardClick(url) : undefined}>
      {icon && <Icon src={withPrefix(icon)} alt={iconAlt} />}
      <ConditionalWrapper
        condition={isCompact || isExtraCompact}
        wrapper={(children) => <CompactTextWrapper>{children}</CompactTextWrapper>}
      >
        {tag && <FlexTag>{tag}</FlexTag>}
        {headline && (
          <Body
            className={cx(headingStyling({ isCompact, isExtraCompact }))}
            compact={isCompact || isExtraCompact}
            weight="medium"
          >
            {headline}
          </Body>
        )}
        {children.map((child, i) => (
          // The cardRef prop's purpose to distinguish wich RefRoles are coming from the Card component (a workaround while we figure out card-ref support in the parser/)
          <ComponentFactory nodeData={child} key={i} cardRef={true} />
        ))}
        {cta && (
          <Body className={cx(bodyStyling)}>
            <Link to={url}>{cta}</Link>
          </Body>
        )}
      </ConditionalWrapper>
    </LeafyGreenCard>
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
  page: PropTypes.object,
};

export default Card;
