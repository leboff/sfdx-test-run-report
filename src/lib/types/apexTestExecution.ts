import ApexClass from "./apexClass";

export default interface ApexTestExecution {
  Id: string
  QueueItemId: string
  StackTrace: string,
  Message: string,
  AsyncApexJobId: string,
  MethodName: string,
  Outcome: string,
  ApexClass: ApexClass
  RunTime: number,
  FullName: string
}
