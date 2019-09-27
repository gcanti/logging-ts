import { Applicative, Applicative1, Applicative2, Applicative3 } from 'fp-ts/lib/Applicative'
import { Apply, Apply1, Apply2, Apply3, sequenceT } from 'fp-ts/lib/Apply'
import { Contravariant2 } from 'fp-ts/lib/Contravariant'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { Predicate } from 'fp-ts/lib/function'

import { option, fromPredicate } from 'fp-ts/lib/Option'
// Adapted from https://github.com/rightfold/purescript-logging

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    Logger: Logger<E, A>
  }
}

export const URI = 'Logger'

export type URI = typeof URI

/** A logger receives records and potentially performs some effects */
export interface Logger<M, A> {
  (a: A): HKT<M, void>
}

export function getSemigroup<M extends URIS3>(M: Apply3<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M extends URIS2>(M: Apply2<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M extends URIS>(M: Apply1<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M>(M: Apply<M>): <A = never>() => Semigroup<Logger<M, A>>
export function getSemigroup<M>(M: Apply<M>): <A = never>() => Semigroup<Logger<M, A>> {
  const applySequenceM = sequenceT(M)
  return () => ({
    concat: (x, y) => a => M.map(applySequenceM(x(a), y(a)), () => undefined)
  })
}

export function getMonoid<M extends URIS3>(M: Applicative3<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M extends URIS2>(M: Applicative2<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M extends URIS>(M: Applicative1<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M>(M: Applicative<M>): <A = never>() => Monoid<Logger<M, A>>
export function getMonoid<M>(M: Applicative<M>): <A = never>() => Monoid<Logger<M, A>> {
  const S = getSemigroup(M)<any>()
  const empty = () => M.of(undefined)
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
  const whenM = option.wither(M)
  return (logger, predicate) => a => M.map(whenM(fromPredicate(predicate)(a), (a) => M.map(logger(a), option.of)), () => undefined)
}

/** Apply a natural transformation to the underlying functor */
export function hoist<F extends URIS3, G extends URIS3>(
  nt: <U, L, A>(fa: Kind3<F, U, L, A>) => Kind3<G, U, L, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F extends URIS2, G extends URIS2>(
  nt: <L, A>(fa: Kind2<F, L, A>) => Kind2<G, L, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F extends URIS, G extends URIS>(
  nt: <A>(fa: Kind<F, A>) => Kind<G, A>
): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F, G>(nt: <A>(fa: HKT<F, A>) => HKT<G, A>): <A>(logger: Logger<F, A>) => Logger<G, A>
export function hoist<F, G>(nt: <A>(fa: HKT<F, A>) => HKT<G, A>): <A>(logger: Logger<F, A>) => Logger<G, A> {
  return logger => a => nt(logger(a))
}

/** Log a record to the logger */
export function log<M extends URIS3, A>(logger: Logger<M, A>): <U, L>(a: A) => Kind3<M, U, L, void>
export function log<M extends URIS2, A>(logger: Logger<M, A>): <L>(a: A) => Kind2<M, L, void>
export function log<M extends URIS, A>(logger: Logger<M, A>): (a: A) => Kind<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void> {
  return a => logger(a)
}

const contramap = <M, A, B>(fa: Logger<M, A>, f: (b: B) => A): Logger<M, B> => {
  return (b) => fa(f(b))
}

export const getLogger = <M extends URIS, A>(l: (a: A) => Kind<M, void>) => l as (a: A) => Kind<M, void> & { _URI: M, _A: void }

export const logger: Contravariant2<URI> = {
  URI,
  contramap
}
