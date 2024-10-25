import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Body } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { withPrefix } from 'gatsby';
import { theme } from '../theme/docsTheme';
import Link from '../components/Link';
import { usePageContext } from '../context/page-context';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { useAllDocsets } from '../hooks/useAllDocsets';
import { getCompleteUrl, getUrl } from '../utils/url-utils';
import { VersionContext } from '../context/version-context';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${theme.size.default};
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

/**
 * @param {string} assetLabel - 'Lab', 'Video', etc
 */
const OfflineNotAvailable = ({ assetLabel }) => {
  const docsets = useAllDocsets();
  const { project } = useSnootyMetadata();
  const { slug } = usePageContext();
  const { activeVersions } = useContext(VersionContext);

  const altText = 'Unavailable offline';
  const imgPath = withPrefix('assets/offline-asset.png');

  const projectPrefix = docsets.find((docset) => docset.project === project)?.prefix?.dotcomprd;
  const prodUrl = getCompleteUrl(getUrl(activeVersions[project], project, projectPrefix, slug));

  return (
    <>
      <hr className={cx(hrStyling)} />
      <Wrapper>
        <ImageContainer>
          <img src={imgPath} alt={altText} height={130} width={198} />
        </ImageContainer>
        <div>
          <Body className={cx(titleStyling)}>{assetLabel} unavailable</Body>
          <Body className={cx(subtitleStyling)}>{assetLabel}s are unavailable in offline mode</Body>
          <StyledLink to={prodUrl} showExternalIcon={true}>
            Link to live site
          </StyledLink>
        </div>
      </Wrapper>
      <hr className={cx(hrStyling)} />
    </>
  );
};

export default OfflineNotAvailable;
