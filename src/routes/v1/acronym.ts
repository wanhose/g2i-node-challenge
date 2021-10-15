import { FastifyInstance, RouteShorthandOptions } from "fastify";

/* eslint-disable @typescript-eslint/no-empty-function */

export default (
  server: FastifyInstance,
  options: RouteShorthandOptions,
  done: () => void
) => {
  server.delete("/acronym/:acronym", (request, reply) => {});

  server.get("/acronym", (request, reply) => {});

  server.post("/acronym", (request, reply) => {});

  server.put("/acronym/:acronym", (request, reply) => {});

  done();
};
