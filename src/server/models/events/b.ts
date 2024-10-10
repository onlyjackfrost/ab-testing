import { EventType, EventInput, BaseEvent } from "./base";

export class EventB extends BaseEvent {
  type = EventType.B;
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
