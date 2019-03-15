import {expect, test} from '@oclif/test'

describe('testrun:view', () => {
  test
    .stdout()
    .command(['testrun:view'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['testrun:view', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
