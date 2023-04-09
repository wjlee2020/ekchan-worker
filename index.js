import { Router } from 'itty-router';

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
router.get('/', () => {
	return new Response('Hello, world! This is the root page of your Worker template.');
});

/*
This route demonstrates path parameters, allowing you to extract fragments from the request
URL.

Try visit /example/hello and see the response.
*/
router.get('/example/:text', ({ params }) => {
	// Decode text like "Hello%20world" into "Hello world"
	let input = decodeURIComponent(params.text);

	// Serialise the input into a base64 string
	let base64 = btoa(input);

	// Return the HTML with the string to the client
	return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
		headers: {
			'Content-Type': 'text/html',
		},
	});
});

router.post('/logger', async (request, env) => {
  const { WEBHOOK_URL } = env;
  const respJson = await request.json();

  try {
    const loggerResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(respJson),
    });

    const returnData = JSON.stringify({ status: 200, msg: "sent to discord"}, null, 2);

    return new Response(returnData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: 400, msg: "logger failed" }))
  }
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
};
