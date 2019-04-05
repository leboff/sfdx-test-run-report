import { join } from 'path';
import * as builder from 'xmlbuilder';
import { ExecutionReporterBase } from './reporter';
export class SonarQubeExecutionReporter extends ExecutionReporterBase {
  constructor(sourcePath: string, outputPath: string) {
    super(sourcePath, outputPath)
  }

  write(){
    var xml = builder.create('testExecutions')
    xml.attribute('version', '1');

    this.tests.forEach((test) => {
      var file = xml.ele('file', {'path': test.path})
      test.tests.forEach((method) => {
        const methodEle = file.ele('testCase', {name: method.name, duration: method.time});
        if(!method.passed){
          const failEle = methodEle.ele('error', {message: method.message || ''})
          if(method.stacktrace){
            failEle.cdata(method.stacktrace);
          }
        }
      })
    });

    xml.end({pretty: true})

    this.writeFile(join(this.outputPath,'sonarqube-generic-execution.xml'), xml)

  }


}
