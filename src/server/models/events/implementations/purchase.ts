import { EventType, BaseEvent, EventInput } from "../base";

export class EventPrice extends BaseEvent {
  type = EventType.PURCHASE;

  constructor(event: EventInput) {
    super(event);
  }

  validate(): { isValid: boolean; message: string } {
    if (!this.properties || !this.testId || !this.properties.price === null) {
      return { isValid: false, message: "Invalid event" };
    }
    // can do more validation here
    return { isValid: true, message: "" };
  }
}
