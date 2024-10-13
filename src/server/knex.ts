interface KnexOptions {
  pgUrl?: string;
  debug?: boolean;
}

export const bootstrapKnex = (options: KnexOptions) => {
  const { pgUrl, debug } = options;
  console.log("using pg");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("knex")({
    client: "pg",
    connection: pgUrl,
    debug,
    pool: { min: 2, max: 10 },
  });
};
