// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { EventInput } from "@/server/models/events";
import { EventFactory } from "@/server/models/factory";
import { EventError } from "@/server/errors/EventError";
import type { NextApiRequest, NextApiResponse } from "next";
import { InMemoryEventQueue } from "@/server/eventQueue";
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

/**
 * add the event to queue, then store it into database asynchronously
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const event = EventFactory.createEvent(req.body as EventInput);

    // add event to queue
    eventQueue.enqueue(event);

    // Return success response
    return res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof EventError) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: `Unknown error: ${error}` });
    }
  }
}
