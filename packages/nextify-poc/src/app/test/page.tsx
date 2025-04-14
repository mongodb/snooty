"use client";
import RootProvider from "@/snooty/components/RootProvider";
import { loadFile } from "@/hooks/useLoadFile";
import Root from "@/snooty/components/Root";
import { MetadataProvider } from "@/snooty/utils/use-snooty-metadata";

export default function Page() {
  const file = loadFile();

  return (
    <MetadataProvider metadata={{ project: "foo", database: {} }}>
      <RootProvider
        remoteMetadata={{}}
        repoBranches={{}}
        slug=""
        headingNodes={[]}
      >
        <Root nodeData={file.data.ast} />
      </RootProvider>
    </MetadataProvider>
  );
}
