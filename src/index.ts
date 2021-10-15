import fastify from "fastify";
import v1AcronymRoutes from "routes/v1/acronym";

const port = process.env.PORT ?? 8080;
const server = fastify({ logger: true });

server.register(v1AcronymRoutes, { prefix: "/rest/v1" });

server.listen(port, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
