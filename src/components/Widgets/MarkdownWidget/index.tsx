import React, { useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { SplitButton } from '@leafygreen-ui/split-button';
import { MenuItem } from '@leafygreen-ui/menu';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { removeTrailingSlash } from '../../../utils/remove-trailing-slash';

const SplitButtonContainer = css`
  div[data-theme] {
    width: 310px;
  }
`;

const CopyPageMarkdownButton = () => {
  const [isCopied, setCopy] = useState<boolean>(false);
  const { origin, pathname } = useLocation();

  const href = `${origin}${pathname}`;

  const copyMarkdown = async (url: string) => {
    const urlWithoutTrailingSlash = removeTrailingSlash(url);

    try {
      const response = await fetch(`${urlWithoutTrailingSlash}.md`);
      if (!response.ok) {
        throw new Error('Failed to fetch Markdown');
      }

      const text = await response.text();
      await navigator.clipboard.writeText(text);

      setCopy(true);

      setTimeout(() => {
        setCopy(false);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SplitButton
      label="Copy page"
      className={cx(SplitButtonContainer)}
      onClick={() => copyMarkdown(href)}
      menuItems={[
        <MenuItem glyph={<Icon glyph="Copy" />} description="Copy this page as Markdown for LLMs">
          Copy Page
        </MenuItem>,
        <MenuItem glyph={<Icon glyph="OpenNewTab" />} description="View this page as Markdown">
          View in Markdown
        </MenuItem>,
      ]}
      leftGlyph={<Icon glyph={!isCopied ? 'Copy' : 'Checkmark'} />}
    />
  );
};

export default CopyPageMarkdownButton;
