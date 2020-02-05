const React = require('react');
const DefaultLayout = require('./src/components/layout').default;

export const wrapPageElement = ({ element, props }) => <DefaultLayout {...props}>{element}</DefaultLayout>;
