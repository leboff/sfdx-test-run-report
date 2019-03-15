import {expect, test} from '@oclif/test'

describe('tests:report', () => {
  test
    .stdout()
    .command(['tests:report'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['tests:report', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
