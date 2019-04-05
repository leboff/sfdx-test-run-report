import {core, flags, SfdxCommand} from '@salesforce/command';
import {AnyJson} from '@salesforce/ts-types';
import * as inquirer from 'inquirer';
import * as sfdx from 'sfdx-node';
import { ChoiceType } from 'inquirer';


// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-test-run-report', 'testrunreport.retrieve');

export default class Retrieve extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx testrunreport:retrieve --targetusername myOrg@example.com --outputDirectory results
  Test results written to results/myOrg@example.com/2019-03-06T09:45:21.000+0000
  `
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    outputdirectory: flags.string({char: 'd', description: messages.getMessage('outputDirectoryFlagDescription'), default: 'test-results'}),
    codecoverage: flags.boolean({char: 'c',  description: messages.getMessage('outputDirectoryFlagDescription')}),
    alltestsonly: flags.boolean({char: 'a', description: messages.getMessage('allTestsOnlyFlagDescription')}),
    uselatest: flags.boolean({char: 'l', description: messages.getMessage('latestRunFlagDescription')}),
    resultformat: flags.boolean({char: 'r',  description: messages.getMessage('resultFormatFlagDescription')}),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { outputdirectory, resultformat, codecoverage, alltestsonly, uselatest } = this.flags;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    const username = this.org.getUsername();

    const query = `select id, AsyncApexJobId, StartTime, status, JobName, Source,
      ClassesCompleted, ClassesEnqueued from ApexTestRunResult
      Where Status = 'Completed'
      ${alltestsonly ? 'and IsAllTests = true' : ''}
      order by starttime desc`;

    // The type we are querying for
    interface ReportOptions {
      codecoverage: boolean,
      resultformat?: string,
      outputdir: string,
      testrunid: string,
      rejectOnError?: boolean
      targetusername: string
    }

    // The type we are querying for
    interface ApexTestRunResult {
      Id: string,
      AsyncApexJobId: string,
      StartTime: string,
      Status: string,
      ClassesCompleted: number,
      ClassesEnqueued: number
    }

    // Query the org
    const result = await conn.tooling.query<ApexTestRunResult>(query);

    // Organization will always return one result, but this is an example of throwing an error
    // The output and --json will automatically be handled for you.
    if (!result.records || result.records.length <= 0) {
      throw new core.SfdxError(messages.getMessage('errorNoResults', [this.org.getOrgId()]));
    }

    const choices: ChoiceType[] = result.records.map((run): ChoiceType => {
      return {
        name: `${run.StartTime} [${run.Status} (${run.ClassesCompleted}/${run.ClassesEnqueued})]`,
        value: run.Id
      }
    })


    let testRun: ApexTestRunResult;
    if(uselatest){
      testRun = result.records[0];
    }
    else{
      const response: any = await inquirer.prompt([{
        name: 'testRun',
        message: 'select a test run',
        type: 'list',
        choices: choices
      }])
      testRun = result.records.find((rec) => rec.Id === response.testRun)
    }



    let reportOpts: ReportOptions = {
      codecoverage: codecoverage,
      testrunid: testRun.AsyncApexJobId,
      outputdir: [outputdirectory, username, testRun.StartTime].join('/'),
      rejectOnError: true,
      targetusername: username
    }

    if(resultformat){
      reportOpts.resultformat = resultformat;
    }

    return sfdx.apex.testReport(reportOpts)
    .then(() => {
      this.ux.log(`Test results written to ${reportOpts.outputdir}`);
    })
    .catch((err) => {
      this.ux.error(err);
    })


  }
}
