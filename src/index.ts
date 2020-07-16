/**
 * Adapted from https://github.com/rightfold/purescript-logging
 *
 * @since 0.3.0
 */
import { Applicative, Applicative1, Applicative2 } from 'fp-ts/lib/Applicative'
import { Predicate } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { MonadIO, MonadIO1, MonadIO2, MonadIO2C, MonadIO3 } from 'fp-ts/lib/MonadIO'
import { Monoid } from 'fp-ts/lib/Monoid'
import { LoggerIO } from './IO'

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

/**
 * Takes a `MonadIO` then a `LoggerIO`,
 * which lifts the `message` to the `LoggerIO` within `MonadIO` and calls the Logger at that point in time.
 *
 * @category Combinator
 *
 * @since 0.3.3
 *
 * @example
 * import { pipe, flow } from 'fp-ts/lib/function'
 * import * as TE from 'fp-ts/lib/TaskEither'
 * import * as C from 'fp-ts/lib/Console'
 *
 * // parts of the program
 * declare const read: (path: string) => TE.TaskEither<Error, string>
 * declare const parse: (content: string) => TE.TaskEither<Error, string>
 * declare const reverse: (content: string) => TE.TaskEither<Error, string>
 * declare const write: (path: string) => (content: string) => TE.TaskEither<Error, void>
 *
 * // program without logging
 * export const program = pipe(
 *   read('in'),
 *   TE.chain(parse),
 *   TE.chain(reverse),
 *   TE.chain(write('out'))
 * )
 *
 * const log = withLogger(TE.taskEither)(C.log)
 *
 * // program with logging
 * export const programWithLogging = pipe(
 *   read('in'),
 *   log(() => 'file accessed!'),
 *   TE.chain(parse),
 *   log(() => 'file contents parsed!'),
 *   TE.chain(reverse),
 *   log(() => 'contents reversed'),
 *   TE.chain(write('out')),
 *   log(() => 'file has been saved!')
 */
export function withLogger<M extends URIS3>(
  M: MonadIO3<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => <R, E>(ma: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export function withLogger<M extends URIS2, E>(
  M: MonadIO2C<M, E>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: Kind2<M, E, A>) => Kind2<M, E, A>
export function withLogger<M extends URIS2>(
  M: MonadIO2<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => <E>(ma: Kind2<M, E, A>) => Kind2<M, E, A>
export function withLogger<M extends URIS>(
  M: MonadIO1<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: Kind<M, A>) => Kind<M, A>
export function withLogger<M>(
  M: MonadIO<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: HKT<M, A>) => HKT<M, A>
export function withLogger<M>(
  M: MonadIO<M>
): <B>(logger: LoggerIO<B>) => <A>(message: (a: A) => B) => (ma: HKT<M, A>) => HKT<M, A> {
  return (logger) => (message) => (ma) => M.chain(ma, (a) => M.map(M.fromIO(logger(message(a))), () => a))
}
