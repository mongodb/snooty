"use client";
import React from "react";
import { loadFile } from "@/hooks/useLoadFile";

import Root from "../snooty/components/Root";
import { Root as RootNode } from "../snooty/types/ast";
import { OFFLINE_HEAD_SCRIPTS } from "../snooty/utils/head-scripts/offline-ui";
import { DefaultLayout } from "../snooty/DefaultLayout";

const metaUrl = `http://www.mongodb.com/docs/assets/meta_generic.png`;
const metaSecureUrl = `https://www.mongodb.com/docs/assets/meta_generic.png`;
const faviconUrl = `https://www.mongodb.com/docs/assets/favicon.ico`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const file = loadFile();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="release" content="1.0" />
        <meta name="version" content="master" />
        <meta property="og:image" content={metaUrl} />
        <meta property="og:image:secure_url" content={metaSecureUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        {...OFFLINE_HEAD_SCRIPTS}
      </head>
      <body>
        <DefaultLayout
          data={{ page: file }}
          pageContext={{
            slug: "",
            repoBranches: {},
            template: "none",
          }}
        >
          <Root nodeData={file.data.ast as RootNode} />
        </DefaultLayout>
      </body>
    </html>
  );
}
