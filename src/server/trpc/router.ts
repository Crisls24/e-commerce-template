import { createTRPCRouter } from "./trpc";
import { productsRouter } from "./routers/products";
import { ordersRouter } from "./routers/orders";
import { cartRouter } from "./routers/cart";
import { storeRouter } from "./routers/store";
import { multiTenantRouter } from "./routers/multi-tenant";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  orders: ordersRouter,
  cart: cartRouter,
  store: storeRouter,
  multiTenant: multiTenantRouter,
});

export type AppRouter = typeof appRouter;
