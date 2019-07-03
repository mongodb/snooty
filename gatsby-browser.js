const React = require('react');
const DefaultLayout = require('./src/components/layout').default;

exports.wrapPageElement = ({ element, props }) => <DefaultLayout {...props}>{element}</DefaultLayout>;
