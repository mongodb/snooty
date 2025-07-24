import ClipboardJS from 'clipboard';
import React, { useEffect } from 'react';

const useCopyClipboard = (
  copied: boolean,
  setCopied: React.Dispatch<React.SetStateAction<boolean>>,
  component: HTMLAnchorElement | null,
  contents: string
) => {
  useEffect(() => {
    // The component should be a ref
    if (!component) {
      return;
    }

    const clipboard = new ClipboardJS(component, {
      text: () => contents,
    });

    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }

    return () => clipboard.destroy();
  }, [component, contents, copied, setCopied]);
};

export default useCopyClipboard;
