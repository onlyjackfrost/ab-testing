import {
  EventType,
  EventInput,
  EventPrice,
  EventTitle,
  IEvent,
} from "@/server/models/events";

export class EventFactory {
  static createEvent(event: EventInput): IEvent {
    switch (event.type) {
      case EventType.PRICE:
        return new EventPrice(event);
      case EventType.TITLE:
        return new EventTitle(event);
      default:
        throw new Error(`Unknown event type: ${event.type}`);
    }
  }
}
