const registerUserSchema = {
  $id: "registerUserSchema",
  type: "object",
  required: ["username", "email", "password"],
  properties: {
    username: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
};

const registerUserResponseSchema = {
  $id: "registerUserResponseSchema",
  type: "object",
  required: ["accessToken"],
  properties: {
    accessToken: { type: "string" },
  },
};

const loginUserSchema = {
  $id: "loginUserSchema",
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
};

const loginUserResponseSchema = {
  $id: "loginUserResponseSchema",
  type: "object",
  required: ["accessToken"],
  properties: {
    accessToken: { type: "string" },
  },
};

export default [
  registerUserSchema,
  registerUserResponseSchema,
  loginUserSchema,
  loginUserResponseSchema,
];
