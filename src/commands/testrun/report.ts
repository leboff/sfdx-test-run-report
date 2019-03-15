import {core, flags, SfdxCommand} from '@salesforce/command';
import {AnyJson} from '@salesforce/ts-types';
import * as inquirer from 'inquirer';
import * as sfdx from 'sfdx-node';
import { ChoiceType } from 'inquirer';


// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('test-results', 'testrun.report');

export default class Report extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx testrun:report --targetusername myOrg@example.com --outputDirectory results
  Test results written to results/myOrg@example.com/2019-03-06T09:45:21.000+0000
  `
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    outputdirectory: flags.string({char: 'd', description: messages.getMessage('outputDirectoryFlagDescription'), default: 'results'}),
    codecoverage: flags.boolean({char: 'c',  description: messages.getMessage('outputDirectoryFlagDescription')}),
    resultformat: flags.boolean({char: 'r',  description: messages.getMessage('resultFormatFlagDescription')}),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { outputdirectory, resultformat, codecoverage } = this.flags;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    const username = this.org.getUsername();

    const query = `select id, AsyncApexJobId, StartTime, status, ClassesCompleted, ClassesEnqueued from ApexTestRunResult Where Status = 'Completed' order by starttime desc`;

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

    const choices: ChoiceType[] = result.records.map((run): ChoiceType => ({name: run.StartTime, value: run.Id}))

    let response: any = await inquirer.prompt([{
      name: 'testRun',
      message: 'select a test run',
      type: 'list',
      choices: choices
    }])

    const testRun: ApexTestRunResult = result.records.find((rec) => rec.Id === response.testRun)


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
