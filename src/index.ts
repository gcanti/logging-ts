/**
 * Adapted from https://github.com/rightfold/purescript-logging
 *
 * @since 0.3.0
 */
import { Applicative, Applicative1 } from 'fp-ts/lib/Applicative'
import { Predicate } from 'fp-ts/lib/function'
import { HKT, Kind, URIS } from 'fp-ts/lib/HKT'
import { Monoid } from 'fp-ts/lib/Monoid'

/**
 * A logger receives records and potentially performs some effects
 *
 * @since 0.3.0
 */
export interface Logger<M, A> {
  (a: A): HKT<M, void>
}

/**
 * @since 0.3.0
 */
export interface LoggerM<M> {
  readonly contramap: <A, B>(fa: Logger<M, A>, f: (b: B) => A) => Logger<M, B>
  readonly filter: <A>(logger: Logger<M, A>, predicate: Predicate<A>) => Logger<M, A>
  readonly getMonoid: <A = never>() => Monoid<Logger<M, A>>
}

/**
 * @since 0.3.0
 */
export interface Logger1<M extends URIS, A> {
  (a: A): Kind<M, void>
}

/**
 * @since 0.3.0
 */
export interface LoggerM1<M extends URIS> {
  readonly contramap: <A, B>(fa: Logger1<M, A>, f: (b: B) => A) => Logger1<M, B>
  readonly filter: <A>(logger: Logger1<M, A>, predicate: Predicate<A>) => Logger1<M, A>
  readonly getMonoid: <A = never>() => Monoid<Logger1<M, A>>
}

/**
 * @since 0.3.0
 */
export function getLoggerM<M extends URIS>(M: Applicative1<M>): LoggerM1<M>
export function getLoggerM<M>(M: Applicative<M>): LoggerM<M>
export function getLoggerM<M>(M: Applicative<M>): LoggerM<M> {
  const empty = () => M.of(undefined)
  return {
    contramap: (fa, f) => b => fa(f(b)),
    filter: (ma, predicate) => a => (predicate(a) ? ma(a) : M.of(undefined)),
    getMonoid: () => ({
      concat: (x, y) => a =>
        M.ap(
          M.map(x(a), () => () => undefined),
          y(a)
        ),
      empty
    })
  }
}
