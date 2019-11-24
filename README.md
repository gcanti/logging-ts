Adapted from [purescript-logging](https://github.com/rightfold/purescript-logging)

# `fp-ts` and TypeScript compatibility

| `logging-ts` version | required `fp-ts` version | required TypeScript version |
| -------------------- | ------------------------ | --------------------------- |
| 0.3.0 (coming soon)  | 2.0.0+                   | 3.5+                        |
| 0.2.0                | 1.7.0+                   | 2.8.0+                      |

# Usage

From `purescript-logging`'s README

> A logger receives records and potentially performs some effects. You can create a logger from any function `(a: A) => HKT<M, void>` for any `A` and `M`.
>
> Unlike most other logging libraries, `logging-ts` has no separate concepts "loggers" and "handlers". Instead, loggers
> can be composed into larger loggers using the `Semigroup` instance. Loggers can also be transformed using `contramap`
> (for transforming records) and `filter` (for filtering records). An example use case might be the following:

```ts
import * as C from 'fp-ts/lib/Console'
import * as D from 'fp-ts/lib/Date'
import { chain, IO } from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'
import * as L from '../src/IO'

type Level = 'Debug' | 'Info' | 'Warning' | 'Error'

interface Entry {
  message: string
  time: Date
  level: Level
}

function showEntry(entry: Entry): string {
  return `[${entry.level}] ${entry.time.toLocaleString()} ${entry.message}`
}

function getLoggerEntry(prefix: string): L.IOLogger<Entry> {
  return entry => C.log(`${prefix}: ${showEntry(entry)}`)
}

const debugLogger = L.filter(getLoggerEntry('debug.log'), e => e.level === 'Debug')
const productionLogger = L.filter(getLoggerEntry('production.log'), e => e.level !== 'Debug')
const logger = L.getMonoid<Entry>().concat(debugLogger, productionLogger)

const info = (message: string) => (time: Date): IO<void> => logger({ message, time, level: 'Info' })
const debug = (message: string) => (time: Date): IO<void> => logger({ message, time, level: 'Debug' })

const program = pipe(
  D.create,
  chain(info('boot')),
  chain(() => D.create),
  chain(debug('Hello!'))
)

program()
/*
production.log: [Info] 10/4/2019, 12:44:48 PM boot
debug.log: [Debug] 10/4/2019, 12:44:48 PM Hello!
*/
```

# Documentation

- [API Reference](https://gcanti.github.io/logging-ts)
