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

  public async fetchData(): Promise<Event[]> {
    const filter: EventFilters = {
      type: EventType.PURCHASE,
    };
    const result = await this.eventRepository.getAllBy(filter);
    return result;
  }

  /**
   *  analyze the events and return the result in the following format:
   *  res = {
   *    overview: {totalPurchaseCount: 5, totalRevenue: 500}
   *    tests: [
   *      {testId: 1, purchaseCount: 2, meanPrice: 100, revenue: 200, purchaseStyle:{subscribeCount: 1, oneTimePurchaseCount: 1}}
   *      {testId: 2, purchaseCount: 3, meanPrice: 100, revenue: 300, purchaseStyle:{subscribeCount: 2, oneTimePurchaseCount: 1}}
   *    ],
   *  }
   */
  public async analyze(events: Event[]) {
    const testIds = uniq(events.map((e) => e.testId));

    // total
    let totalRevenue = 0;
    let totalPurchaseCount = 0;

    // analysis each test
    const testsAnalysis = testIds.map((testId) => {
      const testEvents = events.filter((e) => e.testId === testId);
      const purchaseStyle: Record<string, number> = uniq(
        testEvents.map((e) => <string>e.properties.purchaseType)
      ).reduce((acc: Record<string, number>, purchaseType) => {
        acc[purchaseType] = 0;
        return acc;
      }, {});
      let revenue = 0;
      let purchaseCount = 0;
      testEvents.forEach((e) => {
        purchaseCount++;
        revenue += e.properties.price as number;
        purchaseStyle[<string>e.properties.purchaseType]++;
      });

      totalPurchaseCount += purchaseCount;
      totalRevenue += revenue;

      return {
        testId,
        purchaseCount: purchaseCount,
        meanPrice: (revenue / purchaseCount).toFixed(2),
        revenue: revenue.toFixed(2),
        purchaseStyle,
      };
    });

    const overview = {
      totalPurchaseCount,
      totalRevenue,
    };

    return { tests: testsAnalysis, overview };
  }
}
