import React from "react";
import PropTypes from "prop-types";

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <title>Guides</title>
          <link
            href="https://fonts.googleapis.com/css?family=Inconsolata"
            rel="stylesheet"
            type="text/css"
          />
          <link
            rel="shortcut icon"
            href="https://media.mongodb.org/favicon.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="robots" content="index" />
          <meta name="release" content="1.0" />
          <meta name="version" content="master" />
          <meta
            name="DC.Source"
            content="https://github.com/mongodb/docs-bi-connector/blob/DOCSP-3279/source/index.txt"
          />
          <meta
            property="og:image"
            content="http://s3.amazonaws.com/info-mongodb-com/_com_assets/cms/mongodb-for-giant-ideas-bbab5c3cf8.png"
          />
          <meta
            property="og:image:secure_url"
            content="https://webassets.mongodb.com/_com_assets/cms/mongodb-for-giant-ideas-bbab5c3cf8.png"
          />
          <link rel="stylesheet" href="/static/guides.css" type="text/css" />
          <link rel="stylesheet" href="/static/pygments.css" type="text/css" />
          <link
            rel="stylesheet"
            href="/static/css/navbar.min.css"
            type="text/css"
          />
          <link
            rel="search"
            type="application/opensearchdescription+xml"
            href="https://docs.mongodb.com/osd.xml"
            title="MongoDB Help"
          />
          {this.props.headComponents}
        </head>
        <body
          {...this.props.bodyAttributes}
          data-project="guides"
          data-project-title="MongoDB Guides"
          data-branch="DOCSP-3279"
          data-enable-marian="1"
        >
          <div
            id="navbar"
            data-navprops='{"links": [{"url": "https://docs.mongodb.com/manual/","text": "Server"},{"url": "https://docs.mongodb.com/ecosystem/drivers/","text": "Drivers"},{"url": "https://docs.mongodb.com/cloud/","text": "Cloud"},{"url": "https://docs.mongodb.com/tools/","text": "Tools"},{"url": "https://docs.mongodb.com/guides/","text": "Guides","active": true}]}'
          />
          <script async src="/static/navbar.min.js" />
          {this.props.preBodyComponents}
          <div
            key="body"
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          <script type="text/javascript" src="/static/lib/jquery.min.js" />
          <script type="text/javascript" src="/static/lib/bootstrap.js" />
          <script type="text/javascript" src="/static/controller.js" />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array
};
