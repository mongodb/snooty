import React from 'react';
import styled from '@emotion/styled';
import { Body } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { withPrefix } from 'gatsby';
import { theme } from '../theme/docsTheme';
import { usePageContext } from '../context/page-context';
import { getCompleteUrl } from '../utils/url-utils';
import Link from './Link';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 40px;

  > div {
    max-width: 455px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const titleStyling = css`
  font-size: ${theme.fontSize.h2};
  line-height: ${theme.size.large};
  font-weight: 500;
  margin-bottom: 12px;
`;

const subtitleStyling = css`
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  font-weight: 400;
  color: ${palette.gray.dark1};
`;

const StyledLink = styled(Link)`
  display: inline-block;
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  font-weight: 400;

  @media ${theme.screenSize.upToSmall} {
    margin-top: ${theme.size.default};
    margin-left: 0;
  }
`;

const hrStyling = css`
  border-color: ${palette.gray.light2};
  margin: ${theme.size.medium} 0;
`;

const assetLabelFromKey = {
  instruqt: 'Lab',
  video: 'Video',
};

/**
 * @param {string} assetKey - 'instruqt', 'video', etc
 */
const OfflineNotAvailable = ({ assetKey }: { assetKey: 'instruqt' | 'video' }) => {
  const { slug } = usePageContext();

  const assetLabel = assetLabelFromKey[assetKey];
  const altText = 'Unavailable offline';
  const imgPath = withPrefix('assets/offline-asset.png');
  // TODO alongside DOP-5172: update this URL. missing project in url
  const completeUrl = getCompleteUrl(withPrefix(slug));

  return (
    <>
      <hr className={cx(hrStyling)} />
      <Wrapper>
        <ImageContainer>
          {/* TODO: Ticket for sourcing images offline should allow this to be correctly rendered */}
          <img src={imgPath} alt={altText} height={130} width={198} />
        </ImageContainer>
        <div>
          <Body className={cx(titleStyling)}>{assetLabel} unavailable</Body>
          <Body className={cx(subtitleStyling)}>{assetLabel}s are unavailable in offline mode</Body>
          <StyledLink to={completeUrl} showExternalIcon={true}>
            Link to live site
          </StyledLink>
        </div>
      </Wrapper>
      <hr className={cx(hrStyling)} />
    </>
  );
};

export default OfflineNotAvailable;
