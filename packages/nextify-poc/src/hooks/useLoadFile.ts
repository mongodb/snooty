import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { read } from 'to-vfile'

export const loadFile = async (filePath: string) => {
    const tree = await unified()
        .use(remarkParse)
        .parse(await read(filePath))

    return tree;
};