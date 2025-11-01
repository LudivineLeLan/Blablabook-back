import "dotenv/config";

export default {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
};
