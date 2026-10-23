/**
 * PROTOTYPE (throwaway): body-portaled blank stage that inerts the application root.
 *
 * Mirrors the account-onboarding surface pattern: the portal target is
 * `document.body` (beside `#root`, so platform chrome rules see a window-wide
 * surface), the app root goes `inert` and transparent while the stage is up,
 * and both the corner button and Escape exit it.
 */
import { useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import css from './prototype.module.css'

/**
 * Full-window blank stage used to judge the overlay candidate.
 * @param props.onClose - exit callback shared by the corner button and Escape.
 * @returns the body-portaled stage.
 */
export function ExperimentPrototypeSurface({ onClose }: { onClose: () => void }): ReactNode {
  useLayoutEffect(() => {
    const appRoot = document.getElementById('root')
    if (appRoot === null) return undefined
    const previousInert = appRoot.inert
    const previousOpacity = appRoot.style.opacity
    appRoot.inert = true
    appRoot.style.opacity = '0'
    return () => {
      appRoot.inert = previousInert
      appRoot.style.opacity = previousOpacity
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => { window.removeEventListener('keydown', onKeyDown, true) }
  }, [onClose])

  return createPortal((
    <div className={css.surface} role="dialog" aria-modal="true" aria-label="ExperimentUI prototype">
      <div className={css.dragBand} data-window-drag aria-hidden="true" />
      <button type="button" className={css.close} onClick={onClose} aria-label="Exit ExperimentUI prototype">×</button>
      <div className={css.blank} />
    </div>
  ), document.body)
}
