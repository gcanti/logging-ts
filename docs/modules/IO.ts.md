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
