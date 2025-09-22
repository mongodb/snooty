import React from 'react';
import InlineDefinition from '@leafygreen-ui/inline-definition';
import { theme } from '../../theme/docsTheme';
import { AbbrRoleNode } from '../../types/ast';
import { reportAnalytics } from '../../utils/report-analytics';

export type AbbrProps = {
  nodeData: AbbrRoleNode;
};

const Abbr = ({
  nodeData: {
    children: [{ value }],
  },
}: AbbrProps) => {
  if (!value) {
    return null;
  }

  // Abbreviations are written as as "ABBR (Full Name Here)", so separate this into `abbr` and `expansion`
  let [abbr, expansion] = value.split('(');
  if (expansion) {
    expansion = expansion.split(')')[0];
    abbr = abbr.trim();
  }
  return (
    <InlineDefinition
      popoverZIndex={theme.zIndexes.popovers}
      definition={expansion}
      onClose={() =>
        console.log(
          reportAnalytics('AbbreviatioHoverUsed', {
            event: 'Click',
            eventDescription: 'Abbreviation/Glossary Definition Hover Used',
            properties: {
              position: 'body',
              position_context: expansion,
              label: abbr,
              label_text_displayed: abbr,
            },
          })
        )
      }
    >
      {abbr}
    </InlineDefinition>
  );
};

export default Abbr;
