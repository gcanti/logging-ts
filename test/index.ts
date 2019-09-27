import * as assert from 'assert'
import { getLogger, Logger, filter, getSemigroup, getMonoid, log, hoist, logger } from '../src/'
import { URI as IOURI, io, chain } from 'fp-ts/lib/IO'
import { URI as TaskURI, fromIO } from 'fp-ts/lib/Task'

import { pipe } from 'fp-ts/lib/pipeable'

describe('Logger', () => {
  it('contramap', () => {
    const ledger: Array<number> = []
    const ledgerLogger: Logger<IOURI, number> = getLogger(a => () => { ledger.push(a) })
    const testLogger = logger.contramap(ledgerLogger, (s: string) => s.length)
    log(testLogger)('a')()
    assert.deepEqual(ledger, [1])
  })

  it('getSemigroup', () => {
    const ledger: Array<string> = []
    const S = getSemigroup(io)<string>()
    const ledgerLogger: Logger<IOURI, string> = getLogger(a => () => { ledger.push(a) })
    const testLogger = S.concat(ledgerLogger, ledgerLogger)
    log(testLogger)('a')()
    assert.deepEqual(ledger, ['a', 'a'])
  })

  it('getMonoid', () => {
    const ledger: Array<string> = []
    const M = getMonoid(io)<string>()
    const ledgerLogger: Logger<IOURI, string> = getLogger(a => () => { ledger.push(a) })
    const testLogger = M.concat(ledgerLogger, M.empty)
    log(testLogger)('a')()
    assert.deepEqual(ledger, ['a'])
  })

  it('filter', () => {
    const ledger: Array<string> = []
    const ledgerLogger: Logger<IOURI, string> = getLogger(a => () => { ledger.push(a) })
    const testLogger = filter(io)(ledgerLogger, a => a.length > 2)
    const testLog = log(testLogger)
    testLog('a')()
    testLog('aaa')()
    assert.deepEqual(ledger, ['aaa'])
  })

  it('hoist', () => {
    const ledger: Array<string> = []
    const ledgerLogger: Logger<IOURI, string> = getLogger(a => () => { ledger.push(a) })
    const testLogger = hoist<IOURI, TaskURI>(fromIO)(ledgerLogger)
    const testLog = log(testLogger)
    return Promise.all([testLog('a')()]).then(() => {
      assert.deepEqual(ledger, ['a'])
    })
  })

  it('example', () => {
    const mock: Array<string> = []
    type Level = 'Debug' | 'Info' | 'Warning' | 'Error'

    interface Entry {
      message: string
      time: Date
      level: Level
    }

    const format = (date: Date): string => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    const fileLogger = (path: string): Logger<IOURI, Entry> =>
        getLogger(({ level, time, message }) =>
          () => { mock.push(`${path}: [${level}] ${format(time)} ${message}`) }
        )

    const filterIO = filter(io)
    const debugLogger = filterIO(fileLogger('debug.log'), e => e.level === 'Debug')
    const productionLogger = filterIO(fileLogger('production.log'), e => e.level !== 'Debug')

    const logger = getSemigroup(io)<Entry>().concat(debugLogger, productionLogger)
    const logIO = log(logger)

    const info = (message: string) => (time: Date) => logIO({ message, time, level: 'Info' })
    const debug = (message: string) => (time: Date) => logIO({ message, time, level: 'Debug' })

    const now = () => new Date(1970, 10, 30)

    const program = pipe(
      now,
      chain(info('boot')),
      chain(() => now),
      chain(debug('Hello!'))
    )

    program()
    assert.deepEqual(mock, ['production.log: [Info] 1970-11-30 boot', 'debug.log: [Debug] 1970-11-30 Hello!'])
  })
})
