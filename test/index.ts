import * as assert from 'assert'
import * as C from 'fp-ts/lib/Console'
import * as L from '../src/IO'
import { withLogger } from '../src/IO'
import * as IO from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'

describe('Logger', () => {
  let ledger: Array<number>
  let consolelog: any

  beforeEach(() => {
    ledger = []
    consolelog = console.log
    console.log = (message: any) => ledger.push(message)
  })

  afterEach(() => {
    console.log = consolelog
  })

  it('contramap', () => {
    const logger = L.loggerIO.contramap(C.log, (s: string) => s.length)
    logger('a')()
    assert.deepEqual(ledger, [1])
  })

  it('getSemigroup', () => {
    const S = L.getMonoid<string>()
    const logger = S.concat(C.log, C.log)
    logger('a')()
    assert.deepEqual(ledger, ['a', 'a'])
  })

  it('getMonoid', () => {
    const M = L.getMonoid<string>()
    const logger = M.concat(C.log, M.empty)
    logger('a')()
    assert.deepEqual(ledger, ['a'])
  })

  it('filter', () => {
    const logger = L.filter(C.log, (a: string) => a.length > 2)
    logger('a')()
    logger('aaa')()
    assert.deepEqual(ledger, ['aaa'])
  })
})

describe('withLogger', () => {
  let ledger: Array<number>
  let consolelog: any

  beforeEach(() => {
    ledger = []
    consolelog = console.log
    console.log = (message: any) => ledger.push(message)
  })

  afterEach(() => {
    console.log = consolelog
  })

  describe('sync', () => {
    test('MonadIO1', () => {
      const ioLog = withLogger(IO.io)(C.log)

      const result = pipe(
        IO.of(2),
        ioLog((a) => a + 5)
      )()

      assert.equal(result, 2)
      assert.deepEqual(ledger, [7])
    })
  })
})
