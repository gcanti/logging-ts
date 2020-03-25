import * as assert from 'assert'

import * as T from 'fp-ts/lib/Task'

import * as C from 'fp-ts/lib/Console'
import * as L from '../src/Task'

describe('TaskLogger', () => {
  let ledger: Array<number>
  let consolelog: any

  const asyncLog = (s: unknown) => T.fromIO(C.log(s))

  beforeEach(() => {
    ledger = []
    consolelog = console.log
    console.log = (message: any) => ledger.push(message)
  })

  afterEach(() => {
    console.log = consolelog
  })

  it('contramap', () => {
    const logger = L.loggerTask.contramap(asyncLog, (s: string) => s.length)
    logger('a')()
    assert.deepEqual(ledger, [1])
  })

  it('getSemigroup', () => {
    const S = L.getMonoid<string>()
    const logger = S.concat(asyncLog, asyncLog)
    logger('a')()
    assert.deepEqual(ledger, ['a', 'a'])
  })

  it('getMonoid', () => {
    const M = L.getMonoid<string>()
    const logger = M.concat(asyncLog, M.empty)
    logger('a')()
    assert.deepEqual(ledger, ['a'])
  })

  it('filter', () => {
    const logger = L.filter(asyncLog, (a: string) => a.length > 2)
    logger('a')()
    logger('aaa')()
    assert.deepEqual(ledger, ['aaa'])
  })
})
