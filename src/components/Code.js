import React, { useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { default as CodeBlock } from '@leafygreen-ui/code';
import {
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
} from './URIWriter/constants';
import { TabContext } from './tab-context';
import URIText from './URIWriter/URIText';
import { isBrowser } from '../utils/is-browser';
import codeStyle from '../styles/code.module.css';

const URI_PLACEHOLDERS = [
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
];

const htmlDecode = input => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
};

const Code = ({ nodeData: { copyable, lang = null, linenos, value }, uriWriter: { cloudURI, localURI } }) => {
  const { activeTabs } = useContext(TabContext);

  /*
    TODO: Remove leafyGreenSupportedLangs list once https://jira.mongodb.org/browse/PD-574 
    is resolved and unsupported languages automatically default to 'auto'
    
    leafyGreenSupportedLangs list was created to avoid the error leafygreen's Code
    component throws when encountering an unsupported language
  */
  const leafyGreenSupportedLangs = [
    'javascript',
    'typescript',
    'csp',
    'cpp',
    'go',
    'java',
    'perl',
    'php',
    'python',
    'ruby',
    'scala',
    'swift',
    'kotlin',
    'bash',
    'shell',
    'sql',
    'yaml',
    'json',
    'graphql',
    'auto',
    'none',
  ];

  let code = value;

  if (activeTabs && URI_PLACEHOLDERS.some(placeholder => code.includes(placeholder))) {
    const { cloud } = activeTabs;
    const activeUri = cloud === 'cloud' ? cloudURI : localURI;
    code = ReactDOMServer.renderToString(<URIText value={code} activeDeployment={cloud} uriData={activeUri} />);
    if (isBrowser) code = htmlDecode(code);
  }

  return (
    <CodeBlock
      className={codeStyle.code}
      copyable={copyable}
      language={lang && leafyGreenSupportedLangs.includes(lang) ? lang : 'auto'}
      showLineNumbers={linenos}
      variant="light"
    >
      {code}
    </CodeBlock>
  );
};

Code.propTypes = {
  nodeData: PropTypes.shape({
    lang: PropTypes.string,
    value: PropTypes.string.isRequired,
  }).isRequired,
  uriWriter: PropTypes.shape({
    cloudURI: PropTypes.object,
    localURI: PropTypes.object,
  }),
};

Code.defaultProps = {
  uriWriter: {
    cloudURI: undefined,
    localURI: undefined,
  },
};

export default Code;
