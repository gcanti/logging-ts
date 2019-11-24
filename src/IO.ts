import { Contravariant1 } from 'fp-ts/lib/Contravariant'
import { Predicate } from 'fp-ts/lib/function'
import { IO, io } from 'fp-ts/lib/IO'
import { Monoid } from 'fp-ts/lib/Monoid'
import { pipeable } from 'fp-ts/lib/pipeable'
import { getLoggerM } from '.'

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

const { contramap } = pipeable(loggerIO)

export {
  /**
   * @since 0.3.0
   */
  contramap
}
