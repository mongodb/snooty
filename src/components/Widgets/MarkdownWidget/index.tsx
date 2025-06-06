import React, { useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { SplitButton } from '@leafygreen-ui/split-button';
import { Toast, ToastProvider, Variant } from '@leafygreen-ui/toast';
import { MenuItem } from '@leafygreen-ui/menu';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
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
const SplitButtonStyles = css`
  [data-theme] {
    width: 310px;
  }
  min-width: 145px;
`;

const CopyPageMarkdownButton = ({ className }: CopyPageMarkdownButtonProps) => {
  const [toastOpen, setToastOpen] = useState<ToastOpen>({ open: false, variant: Variant.Success });
  const { origin, pathname } = useLocation();

  const href = `${origin}${pathname}`;
  const urlWithoutTrailingSlash = removeTrailingSlash(href);

  const copyMarkdown = async () => {
    try {
      const response = await fetch(`${urlWithoutTrailingSlash}.md`);
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
    window.location.href = `${urlWithoutTrailingSlash}.md`;
  };

  return (
    <>
      <SplitButton
        label="Copy page"
        className={cx(SplitButtonStyles, className)}
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
            left: auto;
            margin: 16px;
            right: 0;
            z-index: 3;
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
