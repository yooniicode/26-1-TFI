'use client'

import { useEffect, useState } from 'react'

export type LayoutMode = 'mobile' | 'desktop'

const LAYOUT_MODE_KEY = 'byby-layout-mode'

export function useLayoutMode() {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('mobile')

  useEffect(() => {
    const savedLayoutMode = window.localStorage.getItem(LAYOUT_MODE_KEY)
    if (savedLayoutMode === 'mobile' || savedLayoutMode === 'desktop') {
      setLayoutModeState(savedLayoutMode)
    }
  }, [])

  function setLayoutMode(mode: LayoutMode) {
    setLayoutModeState(mode)
    window.localStorage.setItem(LAYOUT_MODE_KEY, mode)
  }

  return { layoutMode, setLayoutMode }
}
