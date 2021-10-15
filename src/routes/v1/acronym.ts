import { FastifyInstance, RouteShorthandOptions } from "fastify";
import prisma from "prisma/client";

type DeleteAcronymParams = {
  acronym: string;
};

type GetAcronymQuerystring = {
  from: number;
  limit: number;
  search: string;
};

type PostAcronymBody = {
  acronym: string;
  meaning: string;
};

/* eslint-disable @typescript-eslint/no-empty-function */

export default (
  server: FastifyInstance,
  options: RouteShorthandOptions,
  done: () => void
) => {
  server.delete<{ Params: DeleteAcronymParams }>(
    "/acronym/:acronym",
    {
      schema: {
        params: {
          properties: {
            acronym: {
              type: "string",
            },
          },
          required: ["acronym"],
          type: "object",
        },
      },
    },
    async (request, reply) => {
      const { acronym } = request.params;
      const match = await prisma.acronym.findFirst({ where: { acronym } });

      if (!match)
        reply.code(400).send(new Error("Ooops! Acronym doesn't exist!"));

      await prisma.acronym.delete({ where: { acronym } });

      reply.send({ success: true });
    }
  );

  server.get<{ Querystring: GetAcronymQuerystring }>(
    "/acronym",
    {
      schema: {
        querystring: {
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
          type: "object",
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

  server.post<{ Body: PostAcronymBody }>(
    "/acronym",
    {
      schema: {
        body: {
          properties: {
            acronym: {
              type: "string",
            },
            meaning: {
              type: "string",
            },
          },
          required: ["acronym", "meaning"],
          type: "object",
        },
      },
    },
    async (request, reply) => {
      const { acronym, meaning } = request.body;
      const match = await prisma.acronym.findFirst({ where: { acronym } });

      if (match) reply.code(400).send(new Error("Ooops! Duplicate acronym!"));

      const result = await prisma.acronym.create({
        data: {
          acronym,
          meaning,
        },
      });

      reply.send({ result });
    }
  );

  server.put("/acronym/:acronym", (request, reply) => {});

  done();
};
