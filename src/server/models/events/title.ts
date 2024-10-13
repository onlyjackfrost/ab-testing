import { EventType, EventInput, BaseEvent } from "./base";

export class EventTitle extends BaseEvent {
  type = EventType.TITLE;
  constructor(event: EventInput) {
    super(event);
  }

  validate(): { isValid: boolean; message: string } {
    if (!this.userId || !this.properties || !this.testId) {
      return { isValid: false, message: "Invalid event" };
    }
    // can do more validation here
    return { isValid: true, message: "" };
  }
}
