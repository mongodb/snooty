import { Paragraph } from "snooty/components";
import { loadFile } from "@/hooks/useLoadFile";
export default async function Page() {
  const file = await loadFile("./src/content/test.mdx");

  console.log("FILE vvvv");
  // console.log(String(file));

  console.log(file);

  return (
    <div>
      {file.children.map((node) => {
        switch (node.type) {
          case "paragraph":
            return (
              <Paragraph
                slug="foo"
                skipPTag={false}
                parentNode=""
                nodeData={{
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      value: "hello!",
                    } as unknown as { type: string } & Record<string, string>,
                  ],
                }}
              />
            );
        }
      })}
    </div>
  );
}
