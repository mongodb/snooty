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

const cardBaseStyles = css`
  display: flex;
  height: 100%;
`;

const landingStyles = css`
  flex-direction: row;
  padding-left: ${theme.size.medium};
  img {
    width: ${theme.size.xlarge};
    height: fit-content;
  }
  div {
    display: flex;
    flex-direction: column;
    margin-left: ${theme.size.large};
    p:first-child {
      font-size: ${theme.fontSize.h2};
      font-weight: 500;
      margin: 0px 0px ${theme.size.default} 0px;
    }
  }

  ${'' /* Mobile view */}
  @media ${theme.screenSize.upToSmall} {
    flex-direction: column;
    img {
      margin-bottom: ${theme.size.medium};
    }
    div {
      margin-left: 0px;
    }
  }
`;

const cardStyling = css`
  flex-direction: column;
  padding: ${theme.size.large};

  p:last-of-type {
    margin-bottom: 0;
  }
`;

const cardDriverStyle = css`
  padding: ${theme.size.default} ${theme.size.medium};
  align-items: center;

  // override "height" HTML attribute
  img {
    height: 100%;
  }

  p {
    margin: 0 0 0 18px;
    font-weight: 400;
  }
`;

const landingBottomStyling = css`
  img {
    width: 50px;
  }
  p {
    font-weight: 500;
    line-height: ${theme.size.medium};
  }
`;

const compactIconStyle = `
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
  @media ${theme.screenSize.upToSmall} {
    width: 20px;
  }
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
  isForDrivers,
  page,
  nodeData: {
    children,
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
}) => {
  const template = page?.options?.template;

  const isLanding = template === 'landing';

  /* If tag == 'landing-bottom', this is 2nd group of cards on 
  landing page which we want to keep exempt from landing styles */
  const isLandingBottom = tag === 'landing-bottom';

  let imgSize;
  if (isLanding && isLandingBottom) imgSize = '50px';
  else if (isLanding) imgSize = theme.size.xlarge;
  else if (template === 'product-landing') imgSize = theme.size.large;
  else imgSize = theme.size.medium;

  const useCompactIcon = !['landing', 'product-landing'].includes(template);

  const styling = [
    cardBaseStyles,
    isForDrivers ? cardDriverStyle : cardStyling,
    isLanding && !isLandingBottom ? landingStyles : '', // must come after other styles to override
    isLandingBottom ? landingBottomStyling : '',
    isCompact || isExtraCompact ? compactCardStyling : '',
  ];

  return (
    <LeafyGreenCard className={cx(styling)} onClick={url ? () => onCardClick(url) : undefined}>
      {icon && (
        <img
          src={withPrefix(icon)}
          alt={iconAlt}
          width={imgSize}
          height={imgSize}
          className={useCompactIcon ? cx(compactIconStyle) : ''}
        />
      )}
      <ConditionalWrapper
        condition={isCompact || isExtraCompact}
        wrapper={(children) => <CompactTextWrapper>{children}</CompactTextWrapper>}
      >
        {tag && !isLandingBottom && <FlexTag>{tag}</FlexTag>}
        <div>
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
        </div>
      </ConditionalWrapper>
    </LeafyGreenCard>
  );
};

Card.propTypes = {
  isForDrivers: PropTypes.bool,
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
