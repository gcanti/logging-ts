---
title: index.ts
nav_order: 2
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [URI (type alias)](#uri-type-alias)
- [Logger (class)](#logger-class)
  - [contramap (method)](#contramap-method)
- [URI (constant)](#uri-constant)
- [logger (constant)](#logger-constant)
- [filter (function)](#filter-function)
- [getMonoid (function)](#getmonoid-function)
- [getSemigroup (function)](#getsemigroup-function)
- [hoist (function)](#hoist-function)
- [log (function)](#log-function)

---

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

# Logger (class)

A logger receives records and potentially performs some effects

**Signature**

```ts
export class Logger<M, A> {
  constructor(readonly run: (a: A) => HKT<M, void>) { ... }
  ...
}
```

## contramap (method)

**Signature**

```ts
contramap<B>(f: (b: B) => A): Logger<M, B> { ... }
```

# URI (constant)

**Signature**

```ts
export const URI = ...
```

# logger (constant)

**Signature**

```ts
export const logger: Contravariant2<URI> = ...
```

# filter (function)

Transform the `Logger` such that it ignores records for which the predicate returns `false`

**Signature**

```ts
export function filter<M extends URIS3>(
  M: Applicative3<M>
): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M extends URIS2>(
  M: Applicative2<M>
): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M extends URIS>(
  M: Applicative1<M>
): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M>(M: Applicative<M>): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A> { ... }
```

# getMonoid (function)

**Signature**

```ts
export function getMonoid<M extends URIS3>(M: Applicative3<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M extends URIS2>(M: Applicative2<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M extends URIS>(M: Applicative1<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M>(M: Applicative<M>): <A = never>() => Monoid<Logger<M, A>> { ... }
```

# getSemigroup (function)

**Signature**

```ts
export function getSemigroup<M extends URIS3>(M: Apply3<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M extends URIS2>(M: Apply2<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M extends URIS>(M: Apply1<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M>(M: Apply<M>): <A = never>() => Semigroup<Logger<M, A>> { ... }
```

# hoist (function)

Apply a natural transformation to the underlying functor

**Signature**

```ts
export function hoist<F extends URIS3, G extends URIS3>(
  nt: <U, L, A>(fa: Type3<F, U, L, A>) => Type3<G, U, L, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F extends URIS2, G extends URIS2>(
  nt: <L, A>(fa: Type2<F, L, A>) => Type2<G, L, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F extends URIS, G extends URIS>(
  nt: <A>(fa: Type<F, A>) => Type<G, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F, G>(nt: <A>(fa: HKT<F, A>) => HKT<G, A>): <A>(logger: Logger<F, A>) => Logger<G, A> { ... }
```

# log (function)

Log a record to the logger

**Signature**

```ts
export function log<M extends URIS3, A>(logger: Logger<M, A>): <U, L>(a: A) => Type3<M, U, L, void>
export function log<M extends URIS2, A>(logger: Logger<M, A>): <L>(a: A) => Type2<M, L, void>
export function log<M extends URIS, A>(logger: Logger<M, A>): (a: A) => Type<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void> { ... }
```
