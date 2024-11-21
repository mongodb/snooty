import axios from 'axios';

async function handleURL({ url }) {
  try {
    const { data } = await axios.get(url, {
      // Throws error whenever response status >= 400
      validateStatus: (status) => {
        console.log(`Returning status ${status} for ${url}`);
        return status < 400;
      },
    });

    return new Response(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, durable, max-age=300',
      },
    });
  } catch (err) {
    console.log({ err });

    if (axios.isAxiosError(err) && err.response) {
      return new Response(null, { status: err.response.status });
    }
    return new Response(null, { status: 500 });
  }
}

// This function exists only to help proxy URLs that were originally causing 403 errors, potentially due
// to IP addresses. (DOP-5189)
async function handler(req, context) {
  const params = context.url.searchParams;
  const url = params.get('url');

  // Log to help keep track of requests
  console.log({ req, context });

  if (url) {
    return handleURL({ url });
  }

  // Expected to only work when a url query param is defined
  return new Response(null, { status: 400 });
}

export default handler;
