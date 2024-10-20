import { NextApiRequest, NextApiResponse } from "next";
import bootstrap from "@/bootstrap";

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { price } = req.body;
  console.log(`create a test with price: ${price}`);
  try {
    await bootstrap.testRepository.insertOne({ price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create test" });
  }

  res.status(200).json({ message: "Test created" });
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const tests = await bootstrap.testRepository.getAll();
  console.log("current tests:", tests);
  res.status(200).json(tests);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // handle POST request
  if (!["POST", "GET"].includes(req.method!)) {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (req.method === "POST") {
    return handlePost(req, res);
  }
  return handleGet(req, res);
}
