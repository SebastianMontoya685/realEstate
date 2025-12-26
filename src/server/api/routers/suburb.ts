import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const suburbRouter = createTRPCRouter({
  // Get all suburbs with their investment scores
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.suburb.findMany({
      orderBy: { investmentScore: "desc" },
      include: {
        _count: {
          select: { pointsOfInterest: true },
        },
      },
    });
  }),

  // Get suburbs for map view (lighter payload)
  getForMap: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.suburb.findMany({
      select: {
        id: true,
        name: true,
        postcode: true,
        latitude: true,
        longitude: true,
        investmentScore: true,
        medianPrice: true,
        priceGrowth12m: true,
        boundaryGeoJson: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  // Get a specific suburb with all details
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.suburb.findUnique({
        where: { id: input.id },
        include: {
          pointsOfInterest: {
            orderBy: { type: "asc" },
          },
        },
      });
    }),

  // Get suburb by name
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.suburb.findUnique({
        where: { name: input.name },
        include: {
          pointsOfInterest: {
            orderBy: { type: "asc" },
          },
        },
      });
    }),

  // Get points of interest for a suburb
  getPOIs: publicProcedure
    .input(z.object({ suburbId: z.string(), type: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.pointOfInterest.findMany({
        where: {
          suburbId: input.suburbId,
          ...(input.type && { type: input.type }),
        },
        orderBy: [{ type: "asc" }, { name: "asc" }],
      });
    }),

  // Search suburbs by name
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.suburb.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        take: 10,
        orderBy: { investmentScore: "desc" },
      });
    }),

  // Get top investment suburbs
  getTopInvestments: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.suburb.findMany({
        where: {
          investmentScore: {
            not: null,
          },
        },
        orderBy: { investmentScore: "desc" },
        take: input.limit,
      });
    }),
});

