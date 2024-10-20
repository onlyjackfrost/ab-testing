import { PricingAnalysis } from "../pricing";
import { EventRepository } from "@/server/repositories/event";
import { TestRepository } from "@/server/repositories/test";
import { EventType } from "@/server/models/events";
import { Knex } from "knex";

// Mock repositories
jest.mock("@/server/repositories/event");
jest.mock("@/server/repositories/test");

describe("PricingAnalysis", () => {
  let pricingAnalysis: PricingAnalysis;
  let mockEventRepository: jest.Mocked<EventRepository>;
  let mockTestRepository: jest.Mocked<TestRepository>;
  let knex: jest.Mocked<Knex>;

  beforeEach(() => {
    mockEventRepository = new EventRepository(
      knex
    ) as jest.Mocked<EventRepository>;
    mockTestRepository = new TestRepository(
      knex
    ) as jest.Mocked<TestRepository>;
    pricingAnalysis = new PricingAnalysis({
      eventRepository: mockEventRepository,
      testRepository: mockTestRepository,
    });
  });

  describe("analyze", () => {
    it("should throw an error if data is not fetched", async () => {
      await expect(pricingAnalysis.analyze()).rejects.toThrow(
        "No analysis data, should fetch data first"
      );
    });

    it("should correctly analyze events and tests", async () => {
      // Mock data
      const mockEvents = [
        {
          testId: "1",
          type: EventType.PURCHASE,
          properties: { price: 100, purchaseType: "subscribe" },
        },
        {
          testId: "1",
          type: EventType.PURCHASE,
          properties: { price: 100, purchaseType: "oneTime" },
        },
        {
          testId: "2",
          type: EventType.PURCHASE,
          properties: { price: 150, purchaseType: "subscribe" },
        },
        {
          testId: "2",
          type: EventType.PURCHASE,
          properties: { price: 150, purchaseType: "subscribe" },
        },
        {
          testId: "2",
          type: EventType.PURCHASE,
          properties: { price: 150, purchaseType: "oneTime" },
        },
      ];
      const mockTests = [
        { id: 1, price: 100 },
        { id: 2, price: 150 },
      ];

      mockEventRepository.getAllBy.mockResolvedValue(mockEvents);
      mockTestRepository.getAll.mockResolvedValue(mockTests);

      await pricingAnalysis.fetchData();
      const result = await pricingAnalysis.analyze();

      expect(result).toEqual({
        overview: {
          totalPurchaseCount: 5,
          totalRevenue: 650,
        },
        tests: [
          {
            testId: "1",
            unitPrice: 100,
            purchaseCount: 2,
            meanPrice: "100.00",
            revenue: "200.00",
            purchaseStyle: { subscribe: 1, oneTime: 1 },
          },
          {
            testId: "2",
            unitPrice: 150,
            purchaseCount: 3,
            meanPrice: "150.00",
            revenue: "450.00",
            purchaseStyle: { subscribe: 2, oneTime: 1 },
          },
        ],
      });
    });

    it("should handle empty event data", async () => {
      mockEventRepository.getAllBy.mockResolvedValue([]);
      mockTestRepository.getAll.mockResolvedValue([]);

      await pricingAnalysis.fetchData();
      const result = await pricingAnalysis.analyze();

      expect(result).toEqual({
        overview: {
          totalPurchaseCount: 0,
          totalRevenue: 0,
        },
        tests: [],
      });
    });

    it("should handle events with missing properties", async () => {
      const mockEvents = [
        { testId: "1", type: EventType.PURCHASE, properties: { price: 100 } },
      ];
      const mockTests = [{ id: 1, price: 100 }];

      mockEventRepository.getAllBy.mockResolvedValue(mockEvents);
      mockTestRepository.getAll.mockResolvedValue(mockTests);

      await pricingAnalysis.fetchData();
      const result = await pricingAnalysis.analyze();

      expect(result).toEqual({
        overview: {
          totalPurchaseCount: 1,
          totalRevenue: 100,
        },
        tests: [
          {
            testId: "1",
            unitPrice: 100,
            purchaseCount: 1,
            meanPrice: "100.00",
            revenue: "100.00",
            purchaseStyle: {},
          },
        ],
      });
    });
  });
});
