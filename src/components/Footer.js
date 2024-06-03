import React from 'react';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { getCurrLocale, onSelectLocale } from '../utils/locale';

const Footer = () => {
  return (
    <UnifiedFooter
      onSelectLocale={onSelectLocale}
      locale={getCurrLocale()}
      enabledLocales={['en-us', 'pt-br', 'ko-kr', 'zh-cn']}
    />
  );
};

export default Footer;
