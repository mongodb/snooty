import axios from 'axios';

async function handleURL({ url, ifModifiedSince }) {
  try {
    const reqHeaders = {};

    if (ifModifiedSince) {
      reqHeaders['If-Modified-Since'] = ifModifiedSince;
    }

    const { data, status } = await axios.get(url, {
      headers: reqHeaders,
      // Throw error whenever response status >= 400
      validateStatus: (status) => {
        console.log(`Returning status ${status} for ${url}`);
        return status < 400;
      },
    });

    return new Response(data, {
      status,
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

async function handler(req, context) {
  const params = context.url.searchParams;
  const url = params.get('url');
  // Netlify does not seem to allow If-Modified-Since header, so we have to receive it differently
  // https://docs.netlify.com/platform/caching/#vary-by-header
  const ifModifiedSince = params.get('ifModifiedSince');

  // Log to help keep track of requests
  console.log({ req, context });

  if (url) {
    return handleURL({ url, ifModifiedSince });
  }

  return new Response('', { status: 200 });
}

export default handler;
