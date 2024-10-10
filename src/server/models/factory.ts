import { EventType, EventInput, EventA, EventB, IEvent } from "./events";

export class EventFactory {
  static createEvent(event: EventInput): IEvent {
    switch (event.type) {
      case EventType.A:
        return new EventA(event);
      case EventType.B:
        return new EventB(event);
    }
  }
}
