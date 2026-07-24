import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { orders, orderItems } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const ordersRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        status: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { storeId, status, page, limit } = input;
      const offset = (page - 1) * limit;
      const conditions = [eq(orders.storeId, storeId)];

      if (status) {
        conditions.push(eq(orders.status, status as any));
      }

      const [items, countResult] = await Promise.all([
        ctx.db
          .select()
          .from(orders)
          .where(and(...conditions))
          .orderBy(desc(orders.createdAt))
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: sql<number>`count(*)::int` })
          .from(orders)
          .where(and(...conditions)),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.id),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      return order;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum([
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [order] = await ctx.db
        .update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.id))
        .returning();

      return order;
    }),

  stats: protectedProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          totalOrders: sql<number>`count(*)::int`,
          totalRevenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
          pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')::int`,
          deliveredOrders: sql<number>`count(*) filter (where ${orders.status} = 'delivered')::int`,
        })
        .from(orders)
        .where(eq(orders.storeId, input.storeId));

      return result[0];
    }),
});
