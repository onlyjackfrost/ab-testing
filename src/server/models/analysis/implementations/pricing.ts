import {
  Event,
  EventFilters,
  EventRepository,
} from "@/server/repositories/event";
import { EventType } from "@/server/models/events";
import { AnalysisType } from "../base";
import { uniq } from "lodash";

export interface PricingAnalysisOptions {
  startDate?: string;
  endDate?: string;
}

export class PricingAnalysis {
  type = AnalysisType.PRICING;
  private eventRepository: EventRepository;

  constructor({ eventRepository }: { eventRepository: EventRepository }) {
    this.eventRepository = eventRepository;
  }

  public async fetchData(options: PricingAnalysisOptions): Promise<Event[]> {
    const filter: EventFilters = {
      type: EventType.PRICE,
      eventTime: { gte: options.startDate, lte: options.endDate },
    };

    const result = await this.eventRepository.getAllBy(filter);
    return result;
  }

  /**
   *  analyze the events and return the result in the following format:
   *  res = {
   *    test_A: {count: 2, meanPrice: 100, revenue: 200}
   *    test_B: {count: 3, meanPrice: 100, revenue: 300}
   *  }
   */
  public async analyze(events: Event[]) {
    const testIds = uniq(events.map((e) => e.testId));
    return testIds.map((testId) => {
      const testEvents = events.filter((e) => e.testId === testId);

      // calculate mean price, fixed to 2 decimal
      const meanPrice = (
        testEvents.reduce((acc, e) => acc + (e.properties.price as number), 0) /
        testEvents.length
      ).toFixed(2);
      // calculate revenue, fixed to 2 decimal
      const revenue = testEvents
        .reduce((acc, e) => acc + (e.properties.price as number), 0)
        .toFixed(2);
      return {
        testId,
        userCount: testEvents.length,
        meanPrice,
        revenue,
      };
    });
  }
}
