import * as trpc from '@trpc/server';

import fetch from 'isomorphic-unfetch';

import { ENDPOINT } from './constant';

async function fetchQuote(): Promise<string> {
  const response = await fetch(ENDPOINT);
  const json = await response.json();

  return json.content;
}

export const router = trpc.router()
  .query('getQuote', {
    async resolve(_) {
      const quote = await fetchQuote();

      return {
        data: quote,
      };
    }
  })
  .subscription('randomQuote', {
    resolve() {
      return new trpc.Subscription<{ data: string }>((emit) => {
        const timer = setInterval(async () => {
          const quote = await fetchQuote();

          emit.data({ data: quote });
        }, 10_000);

        return () => {
          clearInterval(timer);
        }
      });
    }
  });

// export signature
export type AppRouter = typeof router;
