import { InMemoryEventQueue } from "@/server/models/events";
import { bootstrapKnex } from "@/server/knex";
import { EventRepository } from "@/server/repositories/event";
import { getConfig } from "@/config";
import { EventConsumer } from "@/server/backgrounds/consumeEvent";
import { TestRepository } from "./server/repositories/test";

const serverConfig = getConfig();
const knex = bootstrapKnex({
  pgUrl: serverConfig.pgUrl,
  debug: serverConfig.debug,
});
const eventQueue = new InMemoryEventQueue();
const eventRepository = new EventRepository(knex);
const eventConsumer = new EventConsumer({
  eventQueue,
  eventRepository,
});
const testRepository = new TestRepository(knex);
eventConsumer.start();

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  eventQueue,
  eventRepository,
  eventConsumer,
  knex,
  testRepository,
};
