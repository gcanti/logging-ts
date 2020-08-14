---
title: IO.ts
nav_order: 2
parent: Modules
---

# IO overview

Added in v0.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [LoggerIO (interface)](#loggerio-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [contramap](#contramap)
- [filter](#filter)
- [getMonoid](#getmonoid)
- [loggerIO](#loggerio)
- [withLogger](#withlogger)

---

# LoggerIO (interface)

**Signature**

```ts
export interface LoggerIO<A> {
  (a: A): IO<void>
}
```

Added in v0.3.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.3.0

# URI

**Signature**

```ts
export const URI: "LoggerIO" = ...
```

Added in v0.3.0

# contramap

**Signature**

```ts
<A, B>(f: (b: B) => A) => (fa: LoggerIO<A>) => LoggerIO<B>
```

Added in v0.3.0

# filter

**Signature**

```ts
export const filter: <A>(logger: LoggerIO<A>, predicate: Predicate<A>) => LoggerIO<A> = ...
```

Added in v0.3.0

# getMonoid

**Signature**

```ts
export const getMonoid: <A = never>() => Monoid<LoggerIO<A>> = ...
```

Added in v0.3.0

# loggerIO

**Signature**

```ts
export const loggerIO: Contravariant1<URI> = ...
```

Added in v0.3.0

# withLogger

**Signature**

```ts
export function withLogger<M extends URIS3>(
  M: MonadIO3<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => <R, E>(ma: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export function withLogger<M extends URIS2, E>(
  M: MonadIO2C<M, E>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: Kind2<M, E, A>) => Kind2<M, E, A>
export function withLogger<M extends URIS2>(
  M: MonadIO2<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => <E>(ma: Kind2<M, E, A>) => Kind2<M, E, A>
export function withLogger<M extends URIS>(
  M: MonadIO1<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: Kind<M, A>) => Kind<M, A>
export function withLogger<M>(
  M: MonadIO<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: HKT<M, A>) => HKT<M, A> { ... }
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/pipeable'
import * as IO from 'fp-ts/lib/IO'
import * as C from 'fp-ts/lib/Console'
import { withLogger } from 'logging-ts/lib/IO'
import { equal } from 'assert'

const log = withLogger(IO.io)(C.log)

const result = pipe(
  IO.of(3),
  log(n => `lifted "${n}" to the IO monad`), // n === 3
  IO.map(n => n * n),
  log(n => `squared the value, which is "${n}"`) // n === 9
)

equal(result(), 9)
```

Added in v0.3.4
