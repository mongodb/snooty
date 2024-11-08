import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../../theme/docsTheme';
import { CONTENT_MAX_WIDTH } from '../../../templates/product-landing';

export const baseBannerStyle = css`
  margin: ${theme.size.default} 0;

  /* Add margins below all child elements in the banner */
  & > div > div > * {
    margin: 0 0 12px;
  }

  & > div > div > *:last-child {
    margin: 0;
  }

  /* Remove margins on individual paragraphs */
  p {
    margin: 0;
  }

  /* Force all content to be 13px in banners */
  font-size: ${theme.fontSize.small};

  p,
  a {
    font-size: ${theme.fontSize.small};
  }

  a {
    &:hover {
      text-underline-offset: 3px;
    }
  }
`;

export const offlineBannerStyle = ({ template }) => {
  return css`
    max-width: ${CONTENT_MAX_WIDTH}px;
    margin-left: auto;
    margin-right: auto;
  `;
};
