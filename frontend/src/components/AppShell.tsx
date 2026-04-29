'use client'

import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import AppHeader from '@/components/layout/AppHeader'
import AuthGateOverlays from '@/components/layout/AuthGateOverlays'
import { DesktopSidebar, DesktopTopNav, MobileBottomNav } from '@/components/layout/AppNavigation'
import { APP_NAV_ITEMS } from '@/components/layout/navItems'
import { useLayoutMode } from '@/hooks/useLayoutMode'
import { useMe } from '@/hooks/useMe'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: me } = useMe()
  const { layoutMode, setLayoutMode } = useLayoutMode()
  const isDesktopMode = layoutMode === 'desktop'
  const visibleNav = me ? APP_NAV_ITEMS.filter(item => item.roles.includes(me.role)) : []

  return (
    <div className={clsx(
      'min-h-screen bg-gray-50',
      !isDesktopMode && 'max-w-lg mx-auto bg-white shadow-sm',
    )}>
      <AuthGateOverlays me={me} pathname={pathname} />

      <div className={clsx('min-h-screen', isDesktopMode ? 'flex' : 'flex flex-col')}>
        {isDesktopMode && <DesktopSidebar items={visibleNav} pathname={pathname} />}

        <div className="flex min-h-screen flex-1 flex-col bg-white">
          <AppHeader me={me} layoutMode={layoutMode} onLayoutModeChange={setLayoutMode} />
          {isDesktopMode && <DesktopTopNav items={visibleNav} pathname={pathname} />}

          <main className={clsx(
            'flex-1 overflow-y-auto',
            isDesktopMode ? 'px-4 py-5 md:px-6 md:py-6' : 'pb-20 px-4 pt-4',
          )}>
            {children}
          </main>
        </div>
      </div>

      {!isDesktopMode && <MobileBottomNav items={visibleNav} pathname={pathname} />}
    </div>
  )
}
