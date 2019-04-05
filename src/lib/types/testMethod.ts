export default interface TestMethod {
  name: string,
  passed: boolean,
  message?: string,
  stacktrace?: string,
  time: number
}
