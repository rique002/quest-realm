import { createUser, signUser } from "../controllers/user.controller.js";

export default async function (fastify, _opts) {
  fastify.post(
    "/login",
    {
      schema: {
        body: fastify.getSchema("loginUserSchema"),
        response: {
          200: fastify.getSchema("loginUserResponseSchema"),
        },
      },
      preHandler: fastify.auth([fastify.verifyUserAndPassword]),
    },
    signUser(fastify)
  );

  fastify.post(
    "/register",
    {
      schema: {
        body: fastify.getSchema("registerUserSchema"),
        response: {
          201: fastify.getSchema("registerUserResponseSchema"),
        },
      },
    },
    createUser(fastify)
  );

  fastify.get(
    "/auth",
    {
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    (_request, reply) => {
      reply.send("Authenticated");
    }
  );
}
