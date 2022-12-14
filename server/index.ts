import fastify from 'fastify';

import { createContext } from './context';
import { router } from './router';
import { PARAM_LENGTH } from './constant';

import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify/dist/trpc-server-adapters-fastify.cjs';

const server = fastify({
  maxParamLength: PARAM_LENGTH,
});

server.register(ws);
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  useWSS: true,
  trpcOptions: { router, createContext },
});

(async () => {
  try {
    await server.listen({
      port: 3000,
    });

    console.log('App is listening on port 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  } 
})();
