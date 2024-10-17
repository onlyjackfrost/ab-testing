// a api to reset the ab test cookie
export default function handler(req, res) {
  res.setHeader("Set-Cookie", `ab-product=; Path=/; Max-Age=0; HttpOnly`);
  res.status(200).json({ success: true });
}
