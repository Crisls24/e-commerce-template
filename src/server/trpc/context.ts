import { createTRPCContext, type TRPCContext } from "./trpc";

export async function createContext() {
  return createTRPCContext();
}

export type Context = TRPCContext;
