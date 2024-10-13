import { Knex } from "knex";
import { isPlainObject, mapKeys, snakeCase } from "lodash";

// Event model definition
export interface Event {
  type: string;
  userId: string;
  testId: string;
  properties: Record<string, unknown>;
}

export class EventRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public async createEvents(events: Event[]): Promise<void> {
    await this.knex("event").insert(
      events.map((e) => this.transformToDBValue(e))
    );
  }

  private transformToDBValue(data: Event): Record<string, unknown> {
    if (!isPlainObject(data)) {
      throw new Error("Unexpected dbdata");
    }
    return mapKeys(data, (_value: unknown, key: string) => snakeCase(key));
  }
}
