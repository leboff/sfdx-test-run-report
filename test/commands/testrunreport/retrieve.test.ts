import {expect, test} from '@oclif/test'

describe('testrunreport:report', () => {
  test
    .stdout()
    .command(['testrunreport:report'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['testrunreport:report', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
