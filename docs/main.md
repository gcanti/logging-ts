# URI

```ts
type URI = 'Logger'
```

# Logger

```ts
class Logger<M, A> {
  constructor(readonly run: (a: A) => HKT<M, void>)
}
```

## Instances

### Contravariant

### Monoid

```ts
getMonoid = <M>(M: Applicative<M>) => <A>(): Monoid<Logger<M, A>>
```

### Semigroup

```ts
getSemigroup = <M>(M: Apply<M>) => <A>(): Semigroup<Logger<M, A>>
```

## Methods

### contramap

```ts
<B>(f: (b: B) => A): Logger<M, B>
```

# filter

```ts
<M>(M: Applicative<M>) => <A>(logger: Logger<M, A>) => (p: Predicate<A>): Logger<M, A>
```

Transform the `Logger` such that it ignores records for which the predicate returns `false`

# hoist

```ts
<M1, M2>(nt: NaturalTransformation<M1, M2>) => <A>(logger: Logger<M1, A>): Logger<M2, A>
```

Apply a natural transformation to the underlying functor

# log

```ts
<M, A>(logger: Logger<M, A>) => (a: A): HKT<M, void>
```

Log a record to the logger
