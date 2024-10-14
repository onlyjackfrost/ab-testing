import { EventError } from "@/server/errors/EventError";

export enum EventType {
  PRICE = "price",
  TITLE = "title",
}

export interface EventInput {
  type: EventType;
  userId: string;
  testId: string;
  eventTime?: string; // optional, if not provided, will use current time
  properties: Record<string, unknown>;
}

export interface IEvent {
  type: EventType;
  userId: string;
  testId: string;
  eventTime: string; // if not provided, use current time
  properties: Record<string, unknown>;

  validate(): { isValid: boolean; message: string };
}

export class BaseEvent implements IEvent {
  type: EventType;
  userId: string;
  testId: string;
  eventTime: string;
  properties: Record<string, unknown>;

  constructor(event: EventInput) {
    this.type = event.type;
    this.userId = event.userId;
    this.testId = event.testId;
    this.properties = event.properties;
    this.eventTime = event.eventTime || new Date().toISOString();
    const { isValid, message } = this.validate();
    if (!isValid) {
      throw new EventError(message || "Invalid event");
    }
  }

  validate(): { isValid: boolean; message: string } {
    // throw not implemented, should not use this class directly
    throw new Error("Not implemented");
  }

  transformToDBValue(): Record<string, unknown> {
    // throw not implemented, should not use this class directly
    throw new Error("Not implemented");
  }
}
