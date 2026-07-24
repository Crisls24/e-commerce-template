import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { cartItems, products } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        userId: z.string().uuid().optional(),
        sessionId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(cartItems.storeId, input.storeId)];

      if (input.userId) {
        conditions.push(eq(cartItems.userId, input.userId));
      } else if (input.sessionId) {
        conditions.push(eq(cartItems.sessionId, input.sessionId));
      }

      const items = await ctx.db.query.cartItems.findMany({
        where: and(...conditions),
        with: {
          product: true,
        },
      });

      const total = items.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0),
        0
      );

      return { items, total, itemCount: items.length };
    }),

  add: publicProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).default(1),
        userId: z.string().uuid().optional(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: and(
          eq(products.id, input.productId),
          eq(products.isActive, true)
        ),
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      if (
        product.stockQuantity !== null &&
        product.stockQuantity < input.quantity
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient stock",
        });
      }

      const conditions = [
        eq(cartItems.storeId, input.storeId),
        eq(cartItems.productId, input.productId),
      ];

      if (input.userId) {
        conditions.push(eq(cartItems.userId, input.userId));
      } else if (input.sessionId) {
        conditions.push(eq(cartItems.sessionId, input.sessionId));
      }

      const existing = await ctx.db.query.cartItems.findFirst({
        where: and(...conditions),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(cartItems)
          .set({ quantity: (existing.quantity ?? 0) + input.quantity })
          .where(eq(cartItems.id, existing.id))
          .returning();
        return updated;
      }

      const [item] = await ctx.db
        .insert(cartItems)
        .values({
          storeId: input.storeId,
          productId: input.productId,
          quantity: input.quantity,
          userId: input.userId ?? null,
          sessionId: input.sessionId ?? null,
        })
        .returning();

      return item;
    }),

  updateQuantity: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(eq(cartItems.id, input.id))
        .returning();
      return item;
    }),

  remove: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(cartItems).where(eq(cartItems.id, input.id));
      return { success: true };
    }),

  clear: publicProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        userId: z.string().uuid().optional(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conditions = [eq(cartItems.storeId, input.storeId)];

      if (input.userId) {
        conditions.push(eq(cartItems.userId, input.userId));
      } else if (input.sessionId) {
        conditions.push(eq(cartItems.sessionId, input.sessionId));
      }

      await ctx.db.delete(cartItems).where(and(...conditions));
      return { success: true };
    }),
});
