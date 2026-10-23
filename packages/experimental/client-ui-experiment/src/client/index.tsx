/**
 * PROTOTYPE (throwaway): ExperimentUI full-window surface spike.
 *
 * Candidate mechanism 1 from the wayfinder ticket "决定 ExperimentUI 整窗表面的实现机制":
 * register a frame-overlay entry that portals an opaque full-window stage to
 * `document.body` and makes the application root inert while it is mounted.
 * This package exists only to answer that mechanism question; it is not
 * production code and is not part of any shipped composition.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { ExperimentPrototypeEntry } from './ExperimentPrototypeEntry.tsx'

/** Services used by the prototype contribution. */
export const inject = ['slots']

/**
 * Register the prototype launcher into the frame overlay.
 * @param ctx - browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'experiment-ui-prototype',
  }, ExperimentPrototypeEntry))
}
