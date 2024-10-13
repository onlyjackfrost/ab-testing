import { IEventQueue } from "../eventQueue";
import { EventDTO, EventRepository } from "../repositories/event";

export class EventConsumer {
  private eventQueue: IEventQueue;
  private eventRepository: EventRepository;

  constructor({
    eventQueue,
    eventRepository,
  }: {
    eventQueue: IEventQueue;
    eventRepository: EventRepository;
  }) {
    this.eventQueue = eventQueue;
    this.eventRepository = eventRepository;
  }

  public start() {
    // Use an arrow function to preserve 'this' context
    setInterval(() => this.consume(), 1000);
  }

  private async consume() {
    if (this.eventQueue.length() === 0) {
      return;
    }

    const events = await this.eventQueue.dequeue();
    console.log("events", events);
    if (events) {
      await this.eventRepository.createEvents(EventDTO.toEvents(events));
    }
  }
}
