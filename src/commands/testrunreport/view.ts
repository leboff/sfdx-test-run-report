import { core } from '@salesforce/command';
import {Command, flags} from '@oclif/command';
import * as glob from 'glob';

import * as inquirer from 'inquirer';
import { ChoiceType } from 'inquirer';

const XunitViewer = require('xunit-viewer/cli');

core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('sfdx-test-run-report', 'testrunreport.view');

export default class TestrunView extends Command {
  static description = messages.getMessage('commandDescription')

  static flags = {
    inputdir: flags.string({char: 'i', description: messages.getMessage('inputDirFlagDescription'), required: true}),
    port: flags.integer({char: 'p', description: messages.getMessage('portFlagDescription'), default: 3000})
  }

  async run() {
    const {flags} = this.parse(TestrunView)

    const choices = await this.findResults(flags.inputdir);


    let response: any = await inquirer.prompt([{
      name: 'junitFile',
      message: 'select a test run result',
      type: 'list',
      choices: choices
    }]);

    XunitViewer({
      title: 'Xunit Viewer',
      port: flags.port,
      color: true,
      format: 'html',
      results: response.junitFile
    })
  }

  findResults(inputdir): Promise<ChoiceType[]>  {
    return new Promise((resolve, reject) => {
      glob(`**/*-junit.xml`, {root: inputdir}, (err, files) =>{
        if(err) return reject(err);
        resolve(files.map((file): ChoiceType => ({name: file})));
      })
    })
  }
}
