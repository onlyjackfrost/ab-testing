import { pickBy } from "lodash";

export interface ServerConfig {
  pgUrl: string;
  debug: boolean;
}

const defaultConfig: ServerConfig = {
  pgUrl: "postgres://postgres:postgres@localhost:5432/postgres",
  debug: false,
};
const config = {
  pgUrl: process.env.PG_URL,
  debug: process.env.DEBUG === "true",
};

export function getConfig(): ServerConfig {
  return { ...defaultConfig, ...pickBy(config) };
}
