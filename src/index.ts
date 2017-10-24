import { HKT, HKTS, HKTAs, HKT2S, HKT2As, HKT3S, HKT3As } from 'fp-ts/lib/HKT'
import { Contravariant, FantasyContravariant } from 'fp-ts/lib/Contravariant'
import { Apply, applySecond } from 'fp-ts/lib/Apply'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { Applicative, when } from 'fp-ts/lib/Applicative'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Predicate } from 'fp-ts/lib/function'
import { NaturalTransformation } from 'fp-ts/lib/NaturalTransformation'

// Adapted from https://github.com/rightfold/purescript-logging

export const URI = 'Logger'

export type URI = typeof URI

/** A logger receives records and potentially performs some effects */
export class Logger<M, A> implements FantasyContravariant<URI, A> {
  readonly _A: A
  readonly _URI: URI
  constructor(readonly run: (a: A) => HKT<M, void>) {}
  contramap<B>(f: (b: B) => A): Logger<M, B> {
    return new Logger(b => this.run(f(b)))
  }
}

export const contramap = <M, A, B>(f: (b: B) => A, fa: Logger<M, A>): Logger<M, B> => {
  return fa.contramap(f)
}

export const getSemigroup = <M>(M: Apply<M>): (<A>() => Semigroup<Logger<M, A>>) => {
  const applySecondM = applySecond(M)
  return () => ({
    concat: x => y => new Logger(a => applySecondM(x.run(a))(y.run(a)))
  })
}

export const getMonoid = <M>(M: Applicative<M>): (<A>() => Monoid<Logger<M, A>>) => {
  const S = getSemigroup(M)<any>()
  const empty = new Logger<M, any>(() => M.of(undefined))
  return () => ({
    ...S,
    empty: () => empty
  })
}

/** Transform the `Logger` such that it ignores records for which the predicate returns `false` */
export const filter = <M>(M: Applicative<M>): (<A>(logger: Logger<M, A>) => (p: Predicate<A>) => Logger<M, A>) => {
  const whenM = when(M)
  return logger => p => new Logger(a => whenM(p(a), logger.run(a)))
}

/** Apply a natural transformation to the underlying functor */
export const hoist = <M1, M2>(nt: NaturalTransformation<M1, M2>) => <A>(logger: Logger<M1, A>): Logger<M2, A> => {
  return new Logger(a => nt(logger.run(a)))
}

/** Log a record to the logger */
export function log<M extends HKT3S, A>(logger: Logger<M, A>): <U, L>(a: A) => HKT3As<M, U, L, void>
export function log<M extends HKT2S, A>(logger: Logger<M, A>): <L>(a: A) => HKT2As<M, L, void>
export function log<M extends HKTS, A>(logger: Logger<M, A>): (a: A) => HKTAs<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void>
export function log<M, A>(logger: Logger<M, A>): (a: A) => HKT<M, void> {
  return a => logger.run(a)
}

export const logger: Contravariant<URI> = {
  URI,
  contramap
}
