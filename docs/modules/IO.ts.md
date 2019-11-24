---
title: IO.ts
nav_order: 2
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [LoggerIO (interface)](#loggerio-interface)
- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [filter (constant)](#filter-constant)
- [getMonoid (constant)](#getmonoid-constant)
- [loggerIO (constant)](#loggerio-constant)
- [contramap (export)](#contramap-export)

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

# URI (constant)

**Signature**

```ts
export const URI: "LoggerIO" = ...
```

Added in v0.3.0

# filter (constant)

**Signature**

```ts
export const filter: <A>(logger: LoggerIO<A>, predicate: Predicate<A>) => LoggerIO<A> = ...
```

Added in v0.3.0

# getMonoid (constant)

**Signature**

```ts
export const getMonoid: <A = ...
```

Added in v0.3.0

# loggerIO (constant)

**Signature**

```ts
export const loggerIO: Contravariant1<URI> = ...
```

Added in v0.3.0

# contramap (export)

**Signature**

```ts
<A, B>(f: (b: B) => A) => (fa: LoggerIO<A>) => LoggerIO<B>
```

Added in v0.3.0
