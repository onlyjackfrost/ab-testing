import { EventType, BaseEvent, EventInput } from "./base";

export class EventPrice extends BaseEvent {
  type = EventType.PRICE;

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
