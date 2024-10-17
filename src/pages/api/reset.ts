// a api to reset the ab test cookie
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", `ab-product=; Path=/; Max-Age=0; HttpOnly`);
  res.status(200).json({ success: true });
}
