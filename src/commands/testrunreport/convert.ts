import { Command, flags } from '@oclif/command';
import { core } from '@salesforce/command';
import * as Bluebird from 'bluebird';
import * as glob from 'glob';
import { readFile } from 'jsonfile';
import { groupBy } from 'lodash';
import { SourceFileBase, TestCaseBase } from '../../lib/reporters/reporter';
import { SonarQubeCoverageReporter } from '../../lib/reporters/sonarqubeCoverageReporter';
import { SonarQubeExecutionReporter } from '../../lib/reporters/sonarqubeExecutionReporter';


core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('test-run-report', 'testrunreport.convert');

export default class TestrunConvert extends Command {
  static description = messages.getMessage('commandDescription')

  static flags = {
    inputdir: flags.string({char: 'i', description: messages.getMessage('inputDirFlagDescription'), required: true}),
    sourcedir: flags.string({char: 's', description: messages.getMessage('inputDirFlagDescription'), default: './src'}),
    outputdir: flags.string({char: 'd', description: messages.getMessage('inputDirFlagDescription'), default: './test-results'}),
    reporttype: flags.string({char: 'r', description: messages.getMessage('reportTypeFlagDescription'), default: 'sonarqube'})
  }


  async run() {
    const {flags} = this.parse(TestrunConvert)



    interface CoverageItem {
      id: string,
      name: string,
      totalLines: number,
      lines: any
    }


    const sonarQubeCoverageReporter = new SonarQubeCoverageReporter(flags.sourcedir, flags.outputdir)
    const sonarQubeExecutionReporter = new SonarQubeExecutionReporter(flags.sourcedir, flags.outputdir);


    const coverageReporter = this.getCoverageFile(flags.inputdir)
    .then((file) => readFile(file))
    .then((coverageData) => {
      coverageData.forEach((source: CoverageItem) => {

        const sourceFile = new SourceFileBase(source.id, source.name);


        for(var lineNumber in source.lines){
          sourceFile.addLine({
            lineNumber: parseInt(lineNumber),
            covered: source.lines[lineNumber] > 0
          })
        }

        sonarQubeCoverageReporter.addSource(sourceFile)

      })
      sonarQubeCoverageReporter.write();
    });

    const executionReporter = this.getExecutionFile(flags.inputdir)
    .then((file) => readFile(file))
    .then((testData) => {
      const testGroups = groupBy(testData.tests, (test) => test.ApexClass.Name);
      for(var testClass in testGroups){
        const testCase = new TestCaseBase(testClass);
        const testMethods = testGroups[testClass];

        testMethods.forEach((testMethod) => {
          testCase.addMethod({
            name: testMethod.MethodName,
            passed: testMethod.Outcome === 'Pass',
            message: testMethod.Message,
            stacktrace: testMethod.StackTrace,
            time: testMethod.RunTime
          })
        });
        sonarQubeExecutionReporter.addTest(testCase);
      }

      sonarQubeExecutionReporter.write();
    })


    return Bluebird.all([coverageReporter, executionReporter])
  }



  getCoverageFile(inputdir): Bluebird<string> {
    console.log(`using dir ${inputdir}`)
    return new Bluebird((resolve, reject) => {
      glob(`**/*-codecoverage.json`, {root: inputdir}, (err, files) => {
        if(err || files.length == 0) return reject(err);
        console.log(`got file ${files[0]}`)
        resolve(files[0])
      })
    })
  }
  getExecutionFile(inputdir): Bluebird<string> {
    console.log(`using dir ${inputdir}`)
    return new Bluebird((resolve, reject) => {
      glob(`**/test-result-*.json`, {root: inputdir}, (err, files) => {
        if(err || files.length == 0) return reject(err);
        console.log(`got file ${files[0]}`)
        resolve(files[0])
      })
    })
  }
}
