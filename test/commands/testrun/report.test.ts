import {expect, test} from '@oclif/test'

describe('testrun:report', () => {
  test
    .stdout()
    .command(['testrun:report'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['testrun:report', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
