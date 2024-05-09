import bcrypt from "bcrypt";
const SALTS_ROUNDS = 10;

export const createUser = (fastify) => async (request, reply) => {
  const { username, email, password } = request.body;
  const user = await fastify.pg.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length > 0) {
    return reply.code(400).send({ message: "Username already exists" });
  }

  try {
    const hash = await bcrypt.hash(password, SALTS_ROUNDS);
    const results = await fastify.pg.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hash]
    );

    const newUser = results.rows[0];

    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    fastify.jwt.sign(payload, (err, token) => {
      if (err) {
        return reply.code(500).send(err);
      }

      return reply.code(201).send({ accessToken: token });
    });
  } catch (error) {
    return reply.code(500).send(error);
  }
};

export const signUser = (fastify) => async (request, reply) => {
  const user = request.user;

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  fastify.jwt.sign(payload, (err, token) => {
    if (err) {
      return reply.code(500).send(err);
    }

    return reply.code(200).send({ accessToken: token });
  });
};
