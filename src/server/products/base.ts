export interface IProduct<P> {
  page: string; // should be unique across all products or the combination of the customer id and the page should be unique
  testName: string;
  content: P;

  getTestName(): string;
  getPageContent(): P;
}
