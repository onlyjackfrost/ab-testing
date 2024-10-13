import { pickBy } from "lodash";

export interface ServerConfig {
  pgUrl: string;
  debug: boolean;
}

const defaultConfig: ServerConfig = {
  pgUrl: "",
  debug: false,
};
const config = {
  pgUrl: process.env.PG_URL,
  debug: process.env.NODE_ENV,
};

export function getConfig(): ServerConfig {
  return { ...defaultConfig, ...pickBy(config) };
}
