import { NextApiRequest, NextApiResponse } from "next";
import bootstrap from "@/bootstrap";

let assignCount = 0;

const getAssignedKey = (productLength: number) => {
  console.log(`assignCount: ${assignCount}`);
  const mod = assignCount % productLength;
  assignCount++;
  // reset the assign count to 1 if it's too large
  if (assignCount > 1000000 && mod === 0) assignCount = 1;
  return mod;
};

// How to send consistent result to the client:
// There are ways to memorize a user's is using which test, like session.
// There are trade-off between session and cookie. The choice depends on the business goals.
// but for demo purpose, I just use the cookie to memorize the test name.

// About the API design:
// I design this API router only for demo.
// In reality, we might have to make this API general
// and we should know which page content should be rendered from the request(eg. query path, query params, header...)
// then use this identifier to find the content.

// About the random logic:
// There are many ways to decide how to assign the product,
// If userId was provided, we can use it to avoid the same user trying to get advantage by clearing the cookie (using session could avoid this as well)
// If we don't have to distribute the test strictly even, we can use a simple random assign method.
// The assign rules should be decided based on the business goals.
// Here I choose the simplest way, use running integer to assign the product to have a better demo effect.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headerKey = "ab-test";
  let productHeader = req.cookies[headerKey];

  // if no product header or not in the product list, assign a new product
  const tests = await bootstrap.testRepository.getAll();
  const testIds = tests.map((test) => test.id.toString());
  if (!productHeader || !testIds.includes(productHeader)) {
    productHeader = testIds[getAssignedKey(testIds.length)];

    // set the new cookie, and let it expire in 14 days
    res.setHeader(
      "Set-Cookie",
      `${headerKey}=${productHeader}; Path=/; Max-Age=${
        1 * 24 * 60 * 60
      }; HttpOnly`
    );
  }
  const test = tests.find(({ id }) => id.toString() === productHeader);
  // return the corresponding product information
  res.status(200).json({
    content: { price: test!.price },
  });
}
