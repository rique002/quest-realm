import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import bcrypt from "bcrypt";

export default fp(async (fastify) => {
  if (!process.env.RSA_PUBLIC_KEY_BASE_64) {
    throw new Error(
      "Environment variable `RSA_PUBLIC_KEY_BASE_64` is required"
    );
  }

  const publicKey = Buffer.from(
    process.env.RSA_PUBLIC_KEY_BASE_64,
    "base64"
  ).toString("ascii");
  if (!publicKey) {
    fastify.logger.error(
      "Public key not found. Make sure env var `RSA_PUBLIC_KEY_BASE_64` is set."
    );
  }

  fastify.register(jwt, {
    secret: publicKey,
  });

  fastify.register(auth);

  fastify.decorate("verifyJWT", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate("verifyUserAndPassword", async (request, reply) => {
    try {
      const { email, password } = request.body;
      const user = await fastify.pg.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (user.rows.length === 0) {
        return reply.code(401).send({ message: "User not found" });
      }
      const isValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isValid) {
        return reply.code(401).send({ message: "Invalid password" });
      }
      request.user = user.rows[0];
    } catch (err) {
      reply.send(err);
    }
  });
});
