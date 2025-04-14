import remarkParse from "remark-parse";
import { unified } from "unified";

export const loadFile = async (filePath: string) => {
  return {
    type: "paragraph",
    children: [{ type: "text", value: "Hello world!" }],
  };
};
