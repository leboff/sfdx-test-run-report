import SourceLine from './sourceLine';

export default interface SourceFile{
  path: string,
  lines: SourceLine[]
}
