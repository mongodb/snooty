"use client";
import { Paragraph } from "../../snooty/components";
import { loadFile } from "@/hooks/useLoadFile";

export default async function Page() {
  const file = await loadFile("./src/content/test.mdx");

  console.log(file);

  return (
    <div>
      {file.children.map((node) => {
        switch (node.type) {
          case "paragraph": {
            return (
              <Paragraph
                slug="foo"
                skipPTag={false}
                parentNode={undefined}
                nodeData={file}
              />
            );
          }
        }
      })}
    </div>
  );
}
