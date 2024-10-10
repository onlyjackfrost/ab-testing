import { EventType, IEvent, EventInput } from "./base";

export class EventA implements IEvent {
  type = EventType.A;
  userId: string;
  properties: Record<string, unknown>;

  constructor(event: EventInput) {
    this.userId = event.userId;
    this.properties = event.properties;
    const isValid = this.validate();
    if (!isValid) {
      throw new Error("Invalid event");
    }
  }

  validate(): boolean {
    if (!this.userId || !this.properties) {
      return false;
    }
    // can do more validation here
    return true;
  }
}
