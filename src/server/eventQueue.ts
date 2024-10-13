import { IEvent } from "./models/events";

export interface IEventQueue {
  enqueue(event: IEvent): Promise<void>;
  dequeue(): Promise<IEvent[] | undefined>;
  length(): number;
}

/**
 * create a queue to handle the events as an caching layer and as a buffer for the database
 */
export class InMemoryEventQueue implements IEventQueue {
  private queue: IEvent[] = [];

  /**
   * add event to queue
   * @param event
   */
  public async enqueue(event: IEvent) {
    this.queue.push(event);
  }

  /**
   * consume events from queue
   */
  public async dequeue(): Promise<IEvent[] | undefined> {
    // pop the first 20 events
    const events = this.queue.splice(0, 100);
    return events;
  }

  /**
   * get the length of the queue
   */
  length(): number {
    return this.queue.length;
  }
}

// TODO: implement a queue with redis to do persistence
