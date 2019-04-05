import {expect, test} from '@oclif/test'

describe('testrunreport:convert', () => {
  test
    .stdout()
    .command(['testrunreport:convert'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['testrunreport:convert', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
