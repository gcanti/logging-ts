/**
 * @since 0.3.0
 */
import { Contravariant1 } from 'fp-ts/lib/Contravariant'
import { Predicate } from 'fp-ts/lib/function'
import { IO, io } from 'fp-ts/lib/IO'
import { Monoid } from 'fp-ts/lib/Monoid'
import { pipeable } from 'fp-ts/lib/pipeable'
import { getLoggerM } from '.'
import { URIS3, Kind3, URIS2, Kind2, URIS, Kind, HKT } from 'fp-ts/lib/HKT'
import { MonadIO3, MonadIO2C, MonadIO2, MonadIO1, MonadIO } from 'fp-ts/lib/MonadIO'

const T = getLoggerM(io)

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    LoggerIO: LoggerIO<A>
  }
}

/**
 * @since 0.3.0
 */
export const URI = 'LoggerIO'

/**
 * @since 0.3.0
 */
export type URI = typeof URI

/**
 * @since 0.3.0
 */
export interface LoggerIO<A> {
  (a: A): IO<void>
}

/**
 * @since 0.3.0
 */
export const filter: <A>(logger: LoggerIO<A>, predicate: Predicate<A>) => LoggerIO<A> = T.filter

/**
 * @since 0.3.0
 */
export const getMonoid: <A = never>() => Monoid<LoggerIO<A>> = T.getMonoid

/**
 * @since 0.3.0
 */
export const loggerIO: Contravariant1<URI> = {
  URI,
  contramap: T.contramap
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

const { contramap } = pipeable(loggerIO)

export {
  /**
   * @since 0.3.0
   */
  contramap
}
