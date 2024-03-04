import { parse, transform } from "@swc/core";
import { readFile } from "fs";
import { promisify } from "util";
import path from "path";
const readFileAsync = promisify(readFile);

async function main() {
  const documentBody = await readFileAsync(
    path.join(__dirname, "../../snooty/src/components/ComponentFactory.js")
  );

  const parseResult = await parse(documentBody.toString(), {
    jsx: true,
    syntax: "ecmascript",
  });

  console.log(parseResult.body);

  const { code } = await transform(documentBody.toString(), {
    jsc: {
      parser: {
        jsx: true,
        syntax: "ecmascript",
      },
    },
  });
  console.log(code);
}

main();
