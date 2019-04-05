import { join } from 'path';
import * as builder from 'xmlbuilder';
import { CoverageReporterBase } from './reporter';
export class SonarQubeCoverageReporter extends CoverageReporterBase {
  constructor(sourcePath: string, outputPath: string) {
    super(sourcePath, outputPath)
  }

  write(){
    var xml = builder.create('coverage')
    xml.attribute('version', '1');

    this.sourceFiles.forEach((source) => {
      var file = xml.ele('file', {'path': source.path})
      source.lines.forEach((line) => {
        file.ele('lineToCover', {lineNumber: line.lineNumber, covered: !!line.covered});
      });
    });
    xml.end({pretty: true})


    this.writeFile(join(this.outputPath,'sonarqube-generic-coverage.xml'), xml)


  }


}
