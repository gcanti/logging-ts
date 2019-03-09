---
title: Home
nav_order: 1
---

Adapted from [purescript-logging](https://github.com/rightfold/purescript-logging)

# TypeScript compatibility

The stable version is tested against TypeScript 3.1.6, but should run with TypeScript 2.8.0+ too

# Usage

From `purescript-logging`'s README

> A logger receives records and potentially performs some effects. You can create a logger from any function `(a: A) => HKT<M, void>` for any `A` and `M`.
>
> Unlike most other logging libraries, `logging-ts` has no separate concepts "loggers" and "handlers". Instead, loggers
> can be composed into larger loggers using the `Semigroup` instance. Loggers can also be transformed using `contramap`
> (for transforming records) and `filter` (for filtering records). An example use case might be the following:

```ts
import { io } from 'fp-ts/lib/IO'
import * as L from 'logging-ts'
import * as C from 'fp-ts/lib/Console'
import * as D from 'fp-ts/lib/Date'

type Level = 'Debug' | 'Info' | 'Warning' | 'Error'

interface Entry {
  message: string
  time: Date
  level: Level
}

const showEntry = (entry: Entry): string => `[${entry.level}] ${entry.time.toLocaleString()} ${entry.message}`

const getEntryLogger = (prefix: string) => {
  return new L.Logger((entry: Entry) => C.log(`${prefix}: ${showEntry(entry)}`))
}

const filter = L.filter(io)
const debugLogger = filter(getEntryLogger('debug.log'), e => e.level === 'Debug')
const productionLogger = filter(getEntryLogger('production.log'), e => e.level !== 'Debug')
const logger = L.getSemigroup(io)<Entry>().concat(debugLogger, productionLogger)

const log = L.log(logger)

const info = (message: string) => (time: Date) => log({ message, time, level: 'Info' })
const debug = (message: string) => (time: Date) => log({ message, time, level: 'Debug' })

const program = D.create
  .chain(info('boot'))
  .chain(() => D.create)
  .chain(debug('Hello!'))

program.run()
/*
production.log: [Info] 2017-10-17 10:14:21 boot
debug.log: [Debug] 2017-10-17 10:14:21 Hello!
*/
```
