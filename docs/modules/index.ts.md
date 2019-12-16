---
title: index.ts
nav_order: 1
parent: Modules
---

# index overview

Adapted from https://github.com/rightfold/purescript-logging

Added in v0.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [Logger (interface)](#logger-interface)
- [Logger1 (interface)](#logger1-interface)
- [LoggerM (interface)](#loggerm-interface)
- [LoggerM1 (interface)](#loggerm1-interface)
- [getLoggerM (function)](#getloggerm-function)

---

# Logger (interface)

A logger receives records and potentially performs some effects

**Signature**

```ts
export interface Logger<M, A> {
  (a: A): HKT<M, void>
}
```

Added in v0.3.0

# Logger1 (interface)

**Signature**

```ts
export interface Logger1<M extends URIS, A> {
  (a: A): Kind<M, void>
}
```

Added in v0.3.0

# LoggerM (interface)

**Signature**

```ts
export interface LoggerM<M> {
  readonly contramap: <A, B>(fa: Logger<M, A>, f: (b: B) => A) => Logger<M, B>
  readonly filter: <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
  readonly getMonoid: <A = never>() => Monoid<Logger<M, A>>
}
```

Added in v0.3.0

# LoggerM1 (interface)

**Signature**

```ts
export interface LoggerM1<M extends URIS> {
  readonly contramap: <A, B>(fa: Logger1<M, A>, f: (b: B) => A) => Logger1<M, B>
  readonly filter: <A>(logger: Logger1<M, A>, predicate: Predicate<A>) => Logger1<M, A>
  readonly getMonoid: <A = never>() => Monoid<Logger1<M, A>>
}
```

Added in v0.3.0

# getLoggerM (function)

**Signature**

```ts
export function getLoggerM<M extends URIS>(M: Applicative1<M>): LoggerM1<M>
export function getLoggerM<M>(M: Applicative<M>): LoggerM<M> { ... }
```

Added in v0.3.0
