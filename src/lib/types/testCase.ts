import TestMethod from './testMethod';

export default interface TestCase {
  path: string,
  name: string,
  tests: TestMethod []
}
