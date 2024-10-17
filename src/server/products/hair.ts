// we can store the products in the database in the future and allow user to define the products

import { IProduct } from "./base";

// the key of the product would be mapped to the unique id of the product
export const productContents = {
  testA: {
    title: "Chebe Hair Butter",
    price: "$20",
    description: [
      "Perfect for hair moisturization, strength, growth",
      "Prevents split ends, breakage, dry hair",
      "Zero-water formula means your hair can absorb full benefits of organic, natural ingredients",
      "100% natural chebe powder extract from Africa",
      "Used by women from Africa for hair length and retention for centuries",
    ],
    features: [
      "Powerful Moisturization",
      "Prevent breakage and split ends",
      "Strengthen & lengthen hair",
    ],
    plans: [
      {
        size: "8 oz",
        price: "$20",
        perUnit: "$2.50 per oz",
        discount: "Save 30%",
      },
      { size: "4 oz", price: "$16", perUnit: "$4.00 per oz" },
    ],
  } as HairProductContent,
  testB: {
    title: "Chebe Hair Butter Cream",
    price: "$25",
    description: [
      "Deeply moisturizes dry skin and hair",
      "Prevents flaking and irritation",
      "100% organic shea butter from Ghana",
    ],
    features: [
      "Deep Hydration",
      "Natural Ingredients",
      "Soothes Irritated Skin",
    ],
    plans: [
      {
        size: "8 oz",
        price: "$25",
        perUnit: "$3.125 per oz",
        discount: "Save 25%",
      },
      { size: "3 oz", price: "$15", perUnit: "$5.00 per oz" },
    ],
  } as HairProductContent,
};

interface HairProductContent {
  title: string;
  price: string;
  description: string[];
  features: string[];
  plans: {
    size: string;
    price: string;
    perUnit: string;
    discount: string;
  }[];
}

// simulate the product content is querying from the database
export class HairProduct implements IProduct<HairProductContent> {
  page: string = "hairChargingPage";
  testName: string;
  content: HairProductContent;

  constructor(name: string, content: HairProductContent) {
    this.testName = name;
    this.content = content;
  }

  getTestName(): string {
    return `${this.testName}`;
  }

  getPageContent(): HairProductContent {
    return this.content;
  }
}
const productA = new HairProduct("A", productContents.testA);
const productB = new HairProduct("B", productContents.testB);

export const products = [productA, productB];
