// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { EventInput } from "@/server/models/events";
import { EventFactory } from "@/server/models/events";
import { EventError } from "@/server/errors/EventError";
import type { NextApiRequest, NextApiResponse } from "next";
import bootstrap from "@/bootstrap";
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
  const { eventQueue } = bootstrap;
  try {
    // get testId from cookie
    const testId = req.cookies["ab-test"];
    const eventBody = {
      ...req.body,
      testId,
    } as EventInput;
    const event = EventFactory.createEvent(eventBody);

    // add event to queue
    eventQueue.enqueue(event);

    // Return success response
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("error:", error);
    if (error instanceof EventError) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: `Unknown error: ${error}` });
    }
  }
}
