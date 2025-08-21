import React, { useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { SplitButton } from '@leafygreen-ui/split-button';
import { Size } from '@leafygreen-ui/button';
import { Toast, ToastProvider, Variant } from '@leafygreen-ui/toast';
import { MenuItem } from '@leafygreen-ui/menu';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../../theme/docsTheme';
import { removeTrailingSlash } from '../../../utils/remove-trailing-slash';

type ToastOpen = {
  open: boolean;
  variant: Variant;
};

type CopyPageMarkdownButtonProps = {
  className?: string;
};

// This keeps the copy button text jump to a new line when viewing on smaller screens
// [data-theme] is used to increase the width of the dropdown menu to match designs
const splitButtonStyles = css`
  [data-theme] {
    width: 310px;
  }
  min-width: 145px;
`;

const CopyPageMarkdownButton = ({ className }: CopyPageMarkdownButtonProps) => {
  const [toastOpen, setToastOpen] = useState<ToastOpen>({ open: false, variant: Variant.Success });
  const { href } = useLocation();

  // First removing the search and then the trailing slash, since we expect the URL to be available in markdown
  // i.e. https://www.mongodb.com/docs/mcp-server/get-started/?client=cursor&deployment-type=atlas ->
  // https://www.mongodb.com/docs/mcp-server/get-started/ ->
  // https://www.mongodb.com/docs/mcp-server/get-started.md
  const markdownPath = href?.split('?')[0];
  const urlWithoutTrailingSlash = removeTrailingSlash(markdownPath);
  const markdownAddress = `${urlWithoutTrailingSlash}.md`;

  const copyMarkdown = async () => {
    try {
      const response = await fetch(markdownAddress);
      if (!response.ok) {
        throw new Error('Failed to fetch Markdown');
      }

      const text = await response.text();
      await navigator.clipboard.writeText(text);

      setToastOpen({
        open: true,
        variant: Variant.Success,
      });
    } catch (error) {
      console.error(error);
      setToastOpen({
        open: true,
        variant: Variant.Warning,
      });
    }
  };

  const viewMarkdown = () => {
    window.location.href = markdownAddress;
  };

  return (
    <>
      <SplitButton
        label="Copy page"
        className={cx(splitButtonStyles, className)}
        size={Size.Small}
        onClick={() => copyMarkdown()}
        menuItems={[
          <MenuItem
            glyph={<Icon glyph="Copy" />}
            description="Copy this page as Markdown for LLMs"
            onClick={() => copyMarkdown()}
          >
            Copy Page
          </MenuItem>,
          <MenuItem
            glyph={<Icon glyph="OpenNewTab" />}
            description="View this page as Markdown"
            onClick={() => viewMarkdown()}
          >
            View in Markdown
          </MenuItem>,
        ]}
        leftGlyph={<Icon glyph="Copy" />}
      />
      <ToastProvider
        portalClassName={css`
          #lg-toast-region {
            margin: 16px;
            z-index: ${theme.zIndexes.popovers};
          }
        `}
      >
        <Toast
          title={toastOpen.variant === Variant.Success ? 'Copied' : 'Error'}
          description={
            toastOpen.variant === Variant.Success ? 'Page copied as markdown successfully.' : 'Failed to copy markdown.'
          }
          open={toastOpen.open}
          variant={toastOpen.variant}
          timeout={4000}
          onClose={() => setToastOpen({ open: false, variant: Variant.Success })}
        />
      </ToastProvider>
    </>
  );
};

export default CopyPageMarkdownButton;
