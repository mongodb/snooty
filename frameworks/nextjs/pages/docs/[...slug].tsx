import { GetStaticPaths, GetStaticProps } from 'next';

// note: lets change this to SSR
export const getStaticPaths: GetStaticPaths = async () => {
  const { loadBsonFromZip } = await import('../../data/loadBsonData'); // dynamic import = server-only
  console.log('getstaticpaths');
  // TODO: take this from an env file
  const data = loadBsonFromZip('data/docs-landing-DOP-5507-parser-DOP-5589.zip');
  const paths = data.reduce((res, doc) => {
    if (doc.page_id) {
      res.push({
        params: { slug: doc.page_id.split('/'), },
      });
    }
    return res;
  }, []);
  console.log('check paths');
  console.log(JSON.stringify(paths));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { loadBsonFromZip } = await import('../../data/loadBsonData');
  const data = loadBsonFromZip('data/docs-landing-DOP-5507-parser-DOP-5589.zip');
//   const data = loadBsonFromZip('data/pages.zip');

  const slugPath = (params?.slug as string[]).join('/');
  const doc = data.find((d) => d.page_id === slugPath);
  // console.log('check doc', doc)

  return {
    props: { doc },
  };
};

export default function DocPage({ doc }: { doc: any }) {
  return (
    <div>
      This is a page {doc.page_id}
      <br/>
      {JSON.stringify(doc.ast)}
      <br/>
      <h1>{doc.title}</h1>
      <div>{doc.content}</div>
    </div>
  );
}

// NEED A LAYOUT COMPONENT
// NEED A COMPONENT FACTORY TO RECURSIVELY TRAVERSE AST
// NEED COMPONENTS PER DIRECTIVE FOUND IN AST