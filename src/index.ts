/**
 * Adapted from https://github.com/rightfold/purescript-logging
 *
 * @since 0.3.0
 */
import { Applicative, Applicative1, Applicative2 } from 'fp-ts/lib/Applicative'
import { Predicate } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT'
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
 * @since 0.3.3
 */
export interface Logger2<M extends URIS2, E, A> {
  (a: A): Kind2<M, E, void>
}

/**
 * @since 0.3.3
 */
export interface LoggerM2<M extends URIS2> {
  readonly contramap: <E, A, B>(fa: Logger2<M, E, A>, f: (b: B) => A) => Logger2<M, E, B>
  readonly filter: <E, A>(logger: Logger2<M, E, A>, predicate: Predicate<A>) => Logger2<M, E, A>
  readonly getMonoid: <E, A>() => Monoid<Logger2<M, E, A>>
}

/**
 * @since 0.3.0
 */
export function getLoggerM<M extends URIS2>(M: Applicative2<M>): LoggerM2<M>
export function getLoggerM<M extends URIS>(M: Applicative1<M>): LoggerM1<M>
export function getLoggerM<M>(M: Applicative<M>): LoggerM<M>
export function getLoggerM<M>(M: Applicative<M>): LoggerM<M> {
  const empty = () => M.of(undefined)
  return {
    contramap: (fa, f) => (b) => fa(f(b)),
    filter: (ma, predicate) => (a) => (predicate(a) ? ma(a) : M.of(undefined)),
    getMonoid: () => ({
      concat: (x, y) => (a) =>
        M.ap(
          M.map(x(a), () => () => undefined),
          y(a)
        ),
      empty
    })
  }
}
