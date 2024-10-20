import { Knex } from "knex";
import { camelCase, isPlainObject, mapKeys, snakeCase } from "lodash";

// Event model definition
export interface Test {
  id: number;
  price: number;
}

export class TestRepository {
  private knex: Knex;
  private tableName: string;

  constructor(knex: Knex) {
    this.knex = knex;
    this.tableName = "test";
  }

  public async insertOne(test: Partial<Test>): Promise<void> {
    await this.knex(this.tableName).insert(this.transformToDBValue(test));
  }

  public async getAll(): Promise<Test[]> {
    const stmt = this.knex(this.tableName);
    const res = await stmt.select();
    return res.map((r) => this.transformFromDBValue(r));
  }

  private transformToDBValue(data: Partial<Test>): Record<string, unknown> {
    if (!isPlainObject(data)) {
      throw new Error("Unexpected dbdata");
    }
    return mapKeys(data, (_value: unknown, key: string) => snakeCase(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transformFromDBValue(data: any): Test {
    return mapKeys(data, (_value: unknown, key: string) =>
      camelCase(key)
    ) as Test;
  }
}
