import type { AppRouter } from './../server/router';

import { createTRPCClient } from '@trpc/client';
import { httpLink } from '@trpc/client/links/httpLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';

import ws from 'ws';

import fetch from 'isomorphic-unfetch';

const wsClient = createWSClient({
  url: 'ws://localhost:3000/trpc',
  WebSocket: ws as any,
});
const client = createTRPCClient<AppRouter>({
  fetch: fetch,
  links: [
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpLink({
        url: `http://localhost:3000/trpc`,
      }),
    }),
  ],
});

(async () => {
  const quote = await client.query('getQuote');
  console.log(quote);

  let count = 0;

  const unsub = client.subscription('randomQuote', null, {
    onNext(data) {
      console.log(data);

      count++;
      if (count > 3) {
        unsub();
      }
    },
    onError(err) {
      console.error('error', err);
    },
    onDone() {
      console.log('done called - closing websocket');
      wsClient.close();
    },
  });
})();
