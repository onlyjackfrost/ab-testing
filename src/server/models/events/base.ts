export enum EventType {
  A,
  B,
}

export interface EventInput {
  type: EventType;
  userId: string;
  testingCategory: string;
  properties: Record<string, unknown>;
}

export interface IEvent {
  type: EventType;
  userId: string;
  testingCategory: string;
  properties: Record<string, unknown>;

  validate(): { isValid: boolean; message: string };
}

export class BaseEvent implements IEvent {
  type: EventType;
  userId: string;
  testingCategory: string;
  properties: Record<string, unknown>;

  constructor(event: EventInput) {
    this.type = event.type;
    this.userId = event.userId;
    this.testingCategory = event.testingCategory;
    this.properties = event.properties;
    const { isValid, message } = this.validate();
    if (!isValid) {
      throw new Error(message || "Invalid event");
    }
  }

  validate(): { isValid: boolean; message: string } {
    // throw not implemented, should not use this class directly
    throw new Error("Not implemented");
  }
}
