import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stores, userStoreRoles } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const storeRouter = createTRPCRouter({
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: eq(stores.slug, input.slug),
      });

      if (!store) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
      }

      return store;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: eq(stores.id, input.id),
      });

      if (!store) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Store not found" });
      }

      return store;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug =
        input.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now().toString(36);

      const [store] = await ctx.db
        .insert(stores)
        .values({
          name: input.name,
          slug,
          description: input.description,
          ownerId: ctx.user.id,
          currency: input.currency,
        })
        .returning();

      await ctx.db.insert(userStoreRoles).values({
        userId: ctx.user.id,
        storeId: store.id,
        role: "owner",
      });

      return store;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        currency: z.string().optional(),
        taxRate: z.number().min(0).max(100).optional(),
        settings: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, taxRate, ...rest } = input;
      const data: Record<string, any> = { ...rest, updatedAt: new Date() };
      if (taxRate !== undefined) {
        data.taxRate = String(taxRate);
      }
      const [store] = await ctx.db
        .update(stores)
        .set(data)
        .where(eq(stores.id, id))
        .returning();

      return store;
    }),

  userStores: protectedProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.query.userStoreRoles.findMany({
      where: eq(userStoreRoles.userId, ctx.user.id),
      with: {
        store: true,
      },
    });

    return roles
      .filter((r) => r.store != null)
      .map((r) => Object.assign({}, r.store, { role: r.role }));
  }),
});
