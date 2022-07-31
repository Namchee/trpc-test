import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export async function createContext(_: CreateFastifyContextOptions) {
  // return empty, we don't have auth and complex stuff
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
