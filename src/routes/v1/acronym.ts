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

type UpdateAcronymBody = {
  meaning: string;
};

type UpdateAcronymParams = {
  acronym: string;
};

export default (
  server: FastifyInstance,
  options: RouteShorthandOptions,
  done: () => void
) => {
  server.delete<{ Params: DeleteAcronymParams }>(
    "/acronym/:acronym",
    {
      schema: {
        headers: {
          properties: {
            authorization: {
              type: "string",
            },
          },
          required: ["authorization"],
          type: "object",
        },
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

      if (!match) {
        reply.code(400).send(new Error("Ooops! Acronym doesn't exist!"));
        return;
      }

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
          headers: {
            properties: {
              authorization: {
                type: "string",
              },
            },
            required: ["authorization"],
            type: "object",
          },
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

  server.put<{ Body: UpdateAcronymBody; Params: UpdateAcronymParams }>(
    "/acronym/:acronym",
    {
      schema: {
        body: {
          properties: {
            meaning: {
              type: "string",
            },
          },
          required: ["meaning"],
          type: "object",
        },
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
      const { meaning } = request.body;

      const match = await prisma.acronym.findFirst({ where: { acronym } });

      if (!match) {
        reply.code(400).send(new Error("Ooops! Acronym doesn't exist!"));
        return;
      }

      const result = await prisma.acronym.update({
        data: {
          meaning,
        },
        where: {
          acronym,
        },
      });

      reply.send({ result });
    }
  );

  done();
};
