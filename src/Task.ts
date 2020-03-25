/**
 * @since 0.3.2
 */

import { Contravariant1 } from 'fp-ts/lib/Contravariant'
import { Predicate } from 'fp-ts/lib/function'
import { Task, task } from 'fp-ts/lib/Task'
import { Monoid } from 'fp-ts/lib/Monoid'
import { pipeable } from 'fp-ts/lib/pipeable'

import { getLoggerM } from '.'

const T = getLoggerM(task)

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    LoggerTask: LoggerTask<A>
  }
}

/**
 * @since 0.3.2
 */
export const URI = 'LoggerTask'

/**
 * @since 0.3.2
 */
export type URI = typeof URI

/**
 * @since 0.3.2
 */
export interface LoggerTask<A> {
  (a: A): Task<void>
}

/**
 * @since 0.3.2
 */
export const filter: <A>(logger: LoggerTask<A>, predicate: Predicate<A>) => LoggerTask<A> = T.filter

/**
 * @since 0.3.2
 */
export const getMonoid: <A = never>() => Monoid<LoggerTask<A>> = T.getMonoid

/**
 * @since 0.3.2
 */
export const loggerTask: Contravariant1<URI> = {
  URI,
  contramap: T.contramap
}

const { contramap } = pipeable(loggerTask)

export {
  /**
   * @since 0.3.2
   */
  contramap
}
