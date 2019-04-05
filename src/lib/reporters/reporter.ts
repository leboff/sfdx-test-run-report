import { join , dirname} from 'path';
import SourceFile from '../types/sourceFile';
import SourceLine from '../types/sourceLine';
import TestCase from '../types/testCase';
import TestMethod from '../types/testMethod';
import { writeFileSync } from 'fs';
import { ensureDir } from 'fs-extra';

interface SourceType {
  ext: string,
  folder: string
}
export class SourceFileBase implements SourceFile{
  path: string
  lines: SourceLine[]
  name: string
  type: SourceType

  sourceTypes = {
    trigger: {
        ext: 'trigger',
        folder: 'triggers'
    },
    cls: {
      ext: 'cls',
      folder: 'classes'
    }
  }


  constructor(id: string,name: string){
    this.name = name;
    this.lines = [];
    this.type = id.startsWith('01q') ? this.sourceTypes.trigger : this.sourceTypes.cls;
  }

  addLine(sourceLine: SourceLine){
    this.lines.push(sourceLine)
  }

}


interface CoverageReporter {
  addSource(source: SourceFile)
  write()
  outputPath?: string;
}

interface ExecutionReporter {
  addTest(source: TestCase)
  write()
  outputPath?: string;
}


export class ReporterBase {
  writeFile(filePath, data){
    ensureDir(dirname(filePath)).
    then(() => {
      writeFileSync(filePath,data, 'UTF-8')
    });
  }
}

export class CoverageReporterBase extends ReporterBase implements CoverageReporter {
  sourceFiles: SourceFile[]
  sourcePath: string
  outputPath: string
  constructor(sourcePath: string, outputPath: string){
    super()
    this.sourcePath = sourcePath;
    this.outputPath = outputPath;
    this.sourceFiles = [];
  }

  addSource(source: SourceFileBase){
    source.path = join(this.sourcePath, source.type.folder, `${source.name}.${source.type.ext}`)
    this.sourceFiles.push(source);
  }

  write(){
    this.sourceFiles.forEach((sf) => {
      sf.lines.sort((line: SourceLine) => line.lineNumber)
      sf.lines.forEach((line) => {
        console.log(`${sf.path}\t${line.lineNumber}\t${line.covered}`)
      })
    })
  }
}


export class ExecutionReporterBase extends ReporterBase implements ExecutionReporter {
  tests: TestCase[]
  sourcePath: string
  outputPath: string
  constructor(sourcePath: string, outputPath: string){
    super()
    this.sourcePath = sourcePath;
    this.outputPath = outputPath;
    this.tests = [];
  }

  addTest(test: TestCaseBase){
    test.path = join(this.sourcePath, 'classes', `${test.name}.cls`)
    this.tests.push(test);
  }

  write(){
    this.tests.forEach((sf) => {
      sf.tests.forEach((line) => {
        console.log(`${sf.path}\t${line.name}\t${line.passed}\t${line.message}\t${line.time}`)
      })
    })
  }
}


export class TestCaseBase implements TestCase{
  path: string
  tests: TestMethod[]
  name: string


  constructor(name: string){
    this.name = name
    this.tests = [];
  }

  addMethod(testMethod: TestMethod){
    this.tests.push(testMethod);
  }

}
