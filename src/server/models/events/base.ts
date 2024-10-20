import { EventError } from "@/server/errors/EventError";

export enum EventType {
  PURCHASE = "purchase",
}

export interface EventInput {
  type: EventType;
  testId: string;
  properties: Record<string, unknown>;
}

export interface IEvent {
  type: EventType;
  testId: string;
  properties: Record<string, unknown>;

  validate(): { isValid: boolean; message: string };
}

export class BaseEvent implements IEvent {
  type: EventType;
  testId: string;
  properties: Record<string, unknown>;

  constructor(event: EventInput) {
    this.type = event.type;
    this.testId = event.testId;
    this.properties = event.properties;
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
