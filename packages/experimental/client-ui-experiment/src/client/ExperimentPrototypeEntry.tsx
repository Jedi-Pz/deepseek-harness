/**
 * PROTOTYPE (throwaway): launcher pill plus the on-demand full-window stage.
 */
import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { ExperimentPrototypeSurface } from './ExperimentPrototypeSurface.tsx'
import css from './prototype.module.css'

/**
 * Frame-overlay entry that opens the ExperimentUI prototype surface.
 * @param _props - runtime share for the shell.overlay seat (unused by the prototype).
 * @returns the launcher pill and, while open, the body-portaled stage.
 */
export function ExperimentPrototypeEntry(_props: PropsRuntime<'shell.overlay'>): ReactNode {
  const [open, setOpen] = useState(false)
  const openSurface = useCallback(() => { setOpen(true) }, [])
  const closeSurface = useCallback(() => { setOpen(false) }, [])
  return (
    <>
      <button type="button" className={css.launcher} onClick={openSurface}>
        ExperimentUI · prototype
      </button>
      {open ? <ExperimentPrototypeSurface onClose={closeSurface} /> : null}
    </>
  )
}
