import path from "path";
import { fileURLToPath } from "url";
import AutoLoad from "@fastify/autoload";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";
import userSchemas from "./schemas/user.schema.js";

dotenv.config();

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

export default async (fastify, _opts) => {
  fastify.register(fastifyPostgres, {
    connectionString: process.env.PG_CONNECTION_STRING,
  });

  for (const schema of [...userSchemas]) {
    fastify.addSchema(schema);
  }

  fastify.register(AutoLoad, {
    dir: path.join(dirName, "plugins"),
    options: Object.assign({}),
  });

  fastify.register(AutoLoad, {
    dir: path.join(dirName, "routes"),
    options: Object.assign({}),
  });
};
