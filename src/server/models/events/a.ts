import { EventType, BaseEvent, EventInput } from "./base";

export class EventA extends BaseEvent {
  type = EventType.A;

  constructor(event: EventInput) {
    super(event);
  }

  validate(): { isValid: boolean; message: string } {
    if (!this.userId || !this.properties || !this.testingCategory) {
      return { isValid: false, message: "Invalid event" };
    }
    // can do more validation here
    return { isValid: true, message: "" };
  }
}
