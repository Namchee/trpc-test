import type { AppRouter } from './../server/router';
import { createTRPCClient } from '@trpc/client';

import fetch from 'isomorphic-unfetch';

const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:3000/trpc',
  fetch: fetch,
});

(async () => {
  const quote = await client.query('getQuote');
  console.log(quote);
})();
