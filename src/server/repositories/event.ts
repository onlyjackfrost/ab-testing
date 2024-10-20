import { Knex } from "knex";
import { camelCase, isPlainObject, mapKeys, snakeCase } from "lodash";
import { EventType, IEvent } from "../models/events";

// Event model definition
export interface Event {
  type: EventType;
  testId: string;
  properties: Record<string, unknown>;
  createdAt?: string;
}

export interface EventFilters {
  type?: EventType;
  testId?: string;
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

  public async getAllBy(filters: EventFilters): Promise<Event[]> {
    const stmt = this.knex("event");
    if (filters) {
      if (filters.testId) {
        stmt.andWhere("test_id", filters.testId);
      }
      if (filters.type) {
        stmt.andWhere("type", filters.type);
      }
    }
    const res = await stmt.select();
    return res.map((r) => this.transformFromDBValue(r));
  }

  private transformToDBValue(data: Partial<Event>): Record<string, unknown> {
    if (!isPlainObject(data)) {
      throw new Error("Unexpected dbdata");
    }
    return mapKeys(data, (_value: unknown, key: string) => snakeCase(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transformFromDBValue(data: any): Event {
    return mapKeys(data, (_value: unknown, key: string) =>
      camelCase(key)
    ) as Event;
  }
}

// transform from IEvent to Event
export class EventDTO {
  static toEvent(iEvent: IEvent): Event {
    return {
      type: iEvent.type,
      testId: iEvent.testId,
      properties: iEvent.properties,
    };
  }

  static toEvents(iEvents: IEvent[]): Event[] {
    return iEvents.map(this.toEvent);
  }
}
