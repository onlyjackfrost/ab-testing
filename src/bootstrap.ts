import { InMemoryEventQueue } from "@/server/models/events";
import { bootstrapKnex } from "@/server/knex";
import { EventRepository } from "@/server/repositories/event";
import { getConfig } from "@/config";
import { EventConsumer } from "@/server/backgrounds/consumeEvent";

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
eventConsumer.start();

export default { eventQueue, eventRepository, eventConsumer, knex };
