import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { stores } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const multiTenantRouter = createTRPCRouter({
  resolveStore: publicProcedure
    .input(
      z.object({
        slug: z.string().optional(),
        domain: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.slug && !input.domain) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Store slug or domain required",
        });
      }

      const conditions = input.slug
        ? [eq(stores.slug, input.slug)]
        : [eq(stores.slug, input.domain!)];

      const store = await ctx.db.query.stores.findFirst({
        where: and(...conditions, eq(stores.isActive, true)),
      });

      if (!store) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
      }

      return store;
    }),
});
