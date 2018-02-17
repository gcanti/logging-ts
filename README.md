Adapted from [purescript-logging](https://github.com/rightfold/purescript-logging)

# Usage

From `purescript-logging`'s README

> A logger receives records and potentially performs some effects. You can create a logger from any function `(a: A) =>
> HKT<M, void>` for any `A` and `M`.
>
> Unlike most other logging libraries, `logging-ts` has no separate concepts "loggers" and "handlers". Instead, loggers
> can be composed into larger loggers using the `Semigroup` instance. Loggers can also be transformed using `contramap`
> (for transforming records) and `filter` (for filtering records). An example use case might be the following:

```ts
import { Logger, filter, getSemigroup, log } from 'logging-ts'
import { IO, URI, io } from 'fp-ts/lib/IO'

type Level = 'Debug' | 'Info' | 'Warning' | 'Error'

interface Entry {
  message: string
  time: Date
  level: Level
}

const fileLogger = (path: string) =>
  new Logger(
    ({ level, time, message }: Entry) =>
      new IO(() => console.log(`${path}: [${level}] ${time.toLocaleString()} ${message}`))
  )

const filterIO = filter(io)
const debugLogger = filterIO(fileLogger('debug.log'), e => e.level === 'Debug')
const productionLogger = filterIO(fileLogger('production.log'), e => e.level !== 'Debug')

const logger = getSemigroup(io)<Entry>().concat(debugLogger, productionLogger)
const logIO = log(logger)

const info = (message: string) => (time: Date) => logIO({ message, time, level: 'Info' })
const debug = (message: string) => (time: Date) => logIO({ message, time, level: 'Debug' })

const now = new IO(() => new Date())

const program = now
  .chain(info('boot'))
  .chain(() => now)
  .chain(debug('Hello!'))

program.run()
/*
production.log: [Info] 2018-2-17 12:09:47 boot
debug.log: [Debug] 2018-2-17 12:09:47 Hello!
*/
```
