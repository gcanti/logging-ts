import * as assert from 'assert'
import * as C from 'fp-ts/lib/Console'
import * as L from '../src/IO'
import { withLogger } from '../src'
import * as IO from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as IOE from 'fp-ts/lib/IOEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

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

    test('MonadIO2', () => {
      const ioEitherLog = withLogger(IOE.ioEither)(C.log)

      const result = pipe(
        IOE.right(2),
        ioEitherLog((a) => a + 5)
      )()

      assert.deepStrictEqual(result, E.right(2))
      assert.deepEqual(ledger, [7])
    })

    test.skip('MonadIO2C', () => {})
    test.skip('MonadIO3', () => {})
  })

  describe('asynchronous', () => {
    test('MonadIO1', async () => {
      const tlog = withLogger(T.task)(C.log)

      const result = await pipe(
        T.of(2),
        tlog((a) => a + 5)
      )()

      assert.equal(result, 2)
      assert.deepEqual(ledger, [7])
    })

    test('MonadIO2', async () => {
      const ioEitherLog = withLogger(TE.taskEither)(C.log)

      const result = await pipe(
        TE.right(2),
        ioEitherLog((a) => a + 5)
      )()

      assert.deepStrictEqual(result, E.right(2))
      assert.deepEqual(ledger, [7])
    })

    test.skip('MonadIO2C', () => {})
    test.skip('MonadIO3', () => {})
  })
})
