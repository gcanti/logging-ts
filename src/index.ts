import { Applicative, Applicative1, Applicative2, Applicative3, when } from 'fp-ts/lib/Applicative'
import { Apply, Apply1, Apply2, Apply3, applySecond } from 'fp-ts/lib/Apply'
import { Contravariant2 } from 'fp-ts/lib/Contravariant'
import { HKT, Type, Type2, Type3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { Predicate } from 'fp-ts/lib/function'

// Adapted from https://github.com/rightfold/purescript-logging

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT2<L, A> {
    Logger: Logger<L, A>
  }
}

export const URI = 'Logger'

export type URI = typeof URI

/** A logger receives records and potentially performs some effects */
export class Logger<M, A> {
  readonly _A!: A
  readonly _L!: M
  readonly _URI!: URI
  constructor(readonly run: (a: A) => HKT<M, void>) {}
  contramap<B>(f: (b: B) => A): Logger<M, B> {
    return new Logger(b => this.run(f(b)))
  }
}

export function getSemigroup<M extends URIS3>(M: Apply3<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M extends URIS2>(M: Apply2<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M extends URIS>(M: Apply1<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M>(M: Apply<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M>(M: Apply<M>): <A = never>() => Semigroup<Logger<M, A>> {
  const applySecondM = applySecond(M)
  return () => ({
    concat: (x, y) => new Logger(a => applySecondM(x.run(a), y.run(a)))
  })
}

export function getMonoid<M extends URIS3>(M: Applicative3<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M extends URIS2>(M: Applicative2<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M extends URIS>(M: Applicative1<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M>(M: Applicative<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M>(M: Applicative<M>): <A = never>() => Monoid<Logger<M, A>> {
  const S = getSemigroup(M)<any>()
  const empty = new Logger<M, any>(() => M.of(undefined))
  return () => ({
    ...S,
    empty
  })
}

/** Transform the `Logger` such that it ignores records for which the predicate returns `false` */
export function filter<M extends URIS3>(
  M: Applicative3<M>
): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M extends URIS2>(
  M: Applicative2<M>
): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M extends URIS>(
  M: Applicative1<M>
): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M>(M: Applicative<M>): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
export function filter<M>(M: Applicative<M>): <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A> {
  const whenM = when(M)
  return (logger, predicate) => new Logger(a => whenM(predicate(a), logger.run(a)))
}

/** Apply a natural transformation to the underlying functor */
export function hoist<F extends URIS3, G extends URIS3>(
  nt: <U, L, A>(fa: Type3<F, U, L, A>) => Type3<G, U, L, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F extends URIS2, G extends URIS2>(
  nt: <L, A>(fa: Type2<F, L, A>) => Type2<G, L, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F extends URIS, G extends URIS>(
  nt: <A>(fa: Type<F, A>) => Type<G, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F, G>(nt: <A>(fa: HKT<F, A>) => HKT<G, A>): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F, G>(nt: <A>(fa: HKT<F, A>) => HKT<G, A>): <A>(logger: Logger<F, A>) => Logger<G, A> {
  return logger => new Logger(a => nt(logger.run(a)))
}

/** Log a record to the logger */
export function log<M extends URIS3, A>(logger: Logger<M, A>): <U, L>(a: A) => Type3<M, U, L, void>
export function log<M extends URIS2, A>(logger: Logger<M, A>): <L>(a: A) => Type2<M, L, void>
export function log<M extends URIS, A>(logger: Logger<M, A>): (a: A) => Type<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void> {
  return a => logger.run(a)
}

const contramap = <M, A, B>(fa: Logger<M, A>, f: (b: B) => A): Logger<M, B> => {
  return fa.contramap(f)
}

export const logger: Contravariant2<URI> = {
  URI,
  contramap
}
