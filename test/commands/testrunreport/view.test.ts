import {expect, test} from '@oclif/test'

describe('testrunreport:view', () => {
  test
    .stdout()
    .command(['testrunreport:view'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['testrunreport:view', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
