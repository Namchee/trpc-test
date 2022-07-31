import * as trpc from '@trpc/server';

import fetch from 'isomorphic-unfetch';

import { ENDPOINT } from './constant';

export const router = trpc.router()
  .query('getQuote', {
    async resolve(_) {
      const response = await fetch(ENDPOINT);
      const json = await response.json();

      return {
        data: json.content,
      };
    }
});

// export signature
export type AppRouter = typeof router;
