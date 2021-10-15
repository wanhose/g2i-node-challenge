import { FastifyInstance, RouteShorthandOptions } from "fastify";
import prisma from "prisma/client";

type GetAcronymQuerystring = {
  from: number;
  limit: number;
  search: string;
};

/* eslint-disable @typescript-eslint/no-empty-function */

export default (
  server: FastifyInstance,
  options: RouteShorthandOptions,
  done: () => void
) => {
  server.delete("/acronym/:acronym", (request, reply) => {});

  server.get<{ Querystring: GetAcronymQuerystring }>(
    "/acronym",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            from: {
              type: "integer",
            },
            limit: {
              type: "integer",
            },
            search: {
              type: "string",
            },
          },
          required: ["from", "limit", "search"],
        },
      },
    },
    async (request, reply) => {
      const { from, limit, search } = request.query;
      const results = await prisma.acronym.findMany({
        select: {
          acronym: true,
          id: true,
          meaning: true,
        },
        skip: from,
        take: limit,
        where: {
          OR: [
            {
              acronym: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              meaning: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
          deletedAt: null,
        },
      });

      reply.send({ results });
    }
  );

  server.post("/acronym", (request, reply) => {});

  server.put("/acronym/:acronym", (request, reply) => {});

  done();
};
