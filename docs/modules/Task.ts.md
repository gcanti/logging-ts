---
title: Task.ts
nav_order: 3
parent: Modules
---

# Task overview

Added in v0.3.2

---

<h2 class="text-delta">Table of contents</h2>

- [LoggerTask (interface)](#loggertask-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [contramap](#contramap)
- [filter](#filter)
- [getMonoid](#getmonoid)
- [loggerTask](#loggertask)

---

# LoggerTask (interface)

**Signature**

```ts
export interface LoggerTask<A> {
  (a: A): Task<void>
}
```

Added in v0.3.2

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.3.2

# URI

**Signature**

```ts
export const URI: "LoggerTask" = ...
```

Added in v0.3.2

# contramap

**Signature**

```ts
<A, B>(f: (b: B) => A) => (fa: LoggerTask<A>) => LoggerTask<B>
```

Added in v0.3.2

# filter

**Signature**

```ts
export const filter: <A>(logger: LoggerTask<A>, predicate: Predicate<A>) => LoggerTask<A> = ...
```

Added in v0.3.2

# getMonoid

**Signature**

```ts
export const getMonoid: <A = never>() => Monoid<LoggerTask<A>> = ...
```

Added in v0.3.2

# loggerTask

**Signature**

```ts
export const loggerTask: Contravariant1<URI> = ...
```

Added in v0.3.2
