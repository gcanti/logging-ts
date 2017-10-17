import * as assert from 'assert'
import { Logger, filter, getSemigroup, log } from '../src/'
import * as io from 'fp-ts/lib/IO'

describe('getSemigroup', () => {
  it('should concat two loggers', () => {
    const mock: Array<string> = []
    type Level = 'Debug' | 'Info' | 'Warning' | 'Error'

    interface Entry {
      message: string
      time: Date
      level: Level
    }

    const format = (date: Date): string => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    const fileLogger = (path: string): Logger<io.URI, Entry> =>
      new Logger(
        ({ level, time, message }) =>
          new io.IO(() => {
            mock.push(`${path}: [${level}] ${format(time)} ${message}`)
          })
      )

    const filterIO = filter(io)
    const debugLogger = filterIO(fileLogger('debug.log'))(e => e.level === 'Debug')
    const productionLogger = filterIO(fileLogger('production.log'))(e => e.level !== 'Debug')

    const logger = getSemigroup(io)<Entry>().concat(debugLogger)(productionLogger)
    const logIO = log(logger)

    const info = (message: string) => (time: Date) => logIO({ message, time, level: 'Info' })
    const debug = (message: string) => (time: Date) => logIO({ message, time, level: 'Debug' })

    const now = new io.IO(() => new Date(1970, 10, 30))

    const program = now
      .chain(info('boot'))
      .chain(() => now)
      .chain(debug('Hello!'))

    program.run()
    assert.deepEqual(mock, ['production.log: [Info] 1970-11-30 boot', 'debug.log: [Debug] 1970-11-30 Hello!'])
  })
})
