import type { NextApiRequest, NextApiResponse } from "next";
import bootstrap from "@/bootstrap";
import { PricingAnalysis } from "@/server/models/analysis/implementations/pricing";
import { AnalysisType } from "@/server/models/analysis/base";

const { eventRepository, testRepository } = bootstrap;

interface AnalysisFilters {
  startDate?: string;
  endDate?: string;
}

interface AnalysisRequestBody {
  type: AnalysisType;
  filters: AnalysisFilters;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return handlePost(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // get analysis logic based on the analysis type
  const body = req.body as AnalysisRequestBody;
  const analysisType = body.type;
  let analysis;
  switch (analysisType) {
    case AnalysisType.PRICING:
      analysis = new PricingAnalysis({ eventRepository, testRepository });
      break;
    default:
      throw new Error(`Unsupported analysis type: ${analysisType}`);
  }
  // fetch data based on the analysis type
  await analysis.fetchData();
  const result = await analysis.analyze();

  // return the result
  res.status(200).json(result);
}
