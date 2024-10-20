import {
  EventType,
  EventInput,
  EventPrice,
  IEvent,
} from "@/server/models/events";

export class EventFactory {
  static createEvent(event: EventInput): IEvent {
    console.log("event:", event);
    switch (event.type) {
      case EventType.PURCHASE:
        return new EventPrice(event);
      default:
        throw new Error(`Unknown event type: ${event.type}`);
    }
  }
}
