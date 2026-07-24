import { z } from "zod";
import { eq, and, desc, sql, ilike } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { products, categories } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        categoryId: z.string().uuid().optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const { storeId, categoryId, search, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [
        eq(products.storeId, storeId),
        eq(products.isActive, true),
      ];

      if (categoryId) {
        conditions.push(eq(products.categoryId, categoryId));
      }

      if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
      }

      const [items, countResult] = await Promise.all([
        ctx.db
          .select()
          .from(products)
          .where(and(...conditions))
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: sql<number>`count(*)::int` })
          .from(products)
          .where(and(...conditions)),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ storeId: z.string().uuid(), slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: and(
          eq(products.storeId, input.storeId),
          eq(products.slug, input.slug),
          eq(products.isActive, true)
        ),
        with: {
          category: true,
        },
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      return product;
    }),

  create: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        comparePrice: z.number().positive().optional(),
        sku: z.string().optional(),
        stockQuantity: z.number().int().min(0).default(0),
        images: z.array(z.object({ url: z.string(), alt: z.string() })).default([]),
        categoryId: z.string().uuid().optional(),
        isActive: z.boolean().default(true),
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

      const [product] = await ctx.db
        .insert(products)
        .values({ ...input, slug })
        .returning();

      return product;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        comparePrice: z.number().positive().optional(),
        sku: z.string().optional(),
        stockQuantity: z.number().int().min(0).optional(),
        images: z.array(z.object({ url: z.string(), alt: z.string() })).optional(),
        categoryId: z.string().uuid().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [product] = await ctx.db
        .update(products)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

      return product;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  adminList: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { storeId, search, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(products.storeId, storeId)];

      if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
      }

      const [items, countResult] = await Promise.all([
        ctx.db
          .select()
          .from(products)
          .where(and(...conditions))
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: sql<number>`count(*)::int` })
          .from(products)
          .where(and(...conditions)),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),
});
