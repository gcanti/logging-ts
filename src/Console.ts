import { Logger } from './'
import { URI } from 'fp-ts/lib/IO'
import { log } from 'fp-ts/lib/Console'

/** Returns a `Logger` that logs records to the console */
export const console = <A>(f: (a: A) => string): Logger<URI, A> => new Logger(a => log(f(a)))
