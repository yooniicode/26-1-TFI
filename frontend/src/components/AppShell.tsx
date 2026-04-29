'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { authApi } from '@/lib/api'
import { getRequestedMemberRole, type RequestedMemberRole } from '@/lib/authMetadata'
import type { UserRole } from '@/lib/types'
import { useMe } from '@/hooks/useMe'
import clsx from 'clsx'

interface NavItem { href: string; label: string; icon: string; roles: UserRole[] }
type LayoutMode = 'mobile' | 'desktop'

const LAYOUT_MODE_KEY = 'byby-layout-mode'

const NAV: NavItem[] = [
  { href: '/dashboard',     label: '홈',       icon: '⌂', roles: ['admin','interpreter','patient'] },
  { href: '/consultations', label: '보고서',   icon: '□', roles: ['admin','interpreter'] },
  { href: '/patients',      label: '이주민',   icon: '◇', roles: ['admin','interpreter'] },
  { href: '/handovers',     label: '인수인계', icon: '↔', roles: ['admin','interpreter'] },
  { href: '/matching',      label: '매칭',     icon: '◎', roles: ['admin'] },
  { href: '/interpreters',  label: '통번역가', icon: '▣', roles: ['admin'] },
  { href: '/members',       label: '회원',     icon: '○', roles: ['admin'] },
  { href: '/my-records',    label: '내 기록',  icon: '□', roles: ['patient'] },
]

const requestedRoleLabel = (request: RequestedMemberRole) => {
  if (request.role === 'admin') return '센터 직원'
  if (request.interpreterRole === 'FREELANCER') return '프리랜서'
  if (request.interpreterRole === 'STAFF') return '센터 직원'
  return '통번역가'
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: me } = useMe()
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('mobile')
  const [pendingRequest, setPendingRequest] = useState<RequestedMemberRole | null>(null)
  const [bootstrapLoading, setBootstrapLoading] = useState(false)
  const [bootstrapError, setBootstrapError] = useState('')
  const [bootstrapCode, setBootstrapCode] = useState('')

  useEffect(() => {
    const savedLayoutMode = window.localStorage.getItem(LAYOUT_MODE_KEY)
    if (savedLayoutMode === 'mobile' || savedLayoutMode === 'desktop') {
      setLayoutMode(savedLayoutMode)
    }
    createClient().auth.getSession().then(({ data: { session } }) => {
      setPendingRequest(getRequestedMemberRole(session?.user.user_metadata ?? null))
    })
  }, [])

  function handleLayoutModeChange(mode: LayoutMode) {
    setLayoutMode(mode)
    window.localStorage.setItem(LAYOUT_MODE_KEY, mode)
  }

  async function handleLogout() {
    await createClient().auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  async function handleBootstrapAdmin() {
    setBootstrapLoading(true)
    setBootstrapError('')
    try {
      if (!bootstrapCode.trim()) {
        setBootstrapError('관리자 초기 가입 코드를 입력해주세요.')
        setBootstrapLoading(false)
        return
      }
      await authApi.bootstrapAdmin(bootstrapCode.trim())
      await createClient().auth.refreshSession()
      router.replace('/dashboard')
      router.refresh()
    } catch (e) {
      setBootstrapError(e instanceof Error ? e.message : '최초 센터 직원 계정 생성에 실패했습니다.')
      setBootstrapLoading(false)
    }
  }

  const visibleNav = me ? NAV.filter(n => n.roles.includes(me.role)) : []
  const needsApproval = !!me && me.role === 'patient' && !!pendingRequest && !pathname.startsWith('/auth/')
  const needsProfile = !!me && me.role !== 'admin' && !me.entityId && !needsApproval && !pathname.startsWith('/auth/')
  const isDesktopMode = layoutMode === 'desktop'

  return (
    <div className={clsx(
      'min-h-screen bg-gray-50',
      !isDesktopMode && 'max-w-lg mx-auto bg-white shadow-sm',
    )}>
      {needsProfile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-10">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <p className="text-lg mb-1">반갑습니다</p>
            <h2 className="text-base font-bold mb-2">기본 정보를 입력해 주세요</h2>
            <p className="text-sm text-gray-500 mb-5">
              서비스 이용을 위해 이름과 역할 정보를 먼저 등록해 주세요.
            </p>
            <button
              onClick={() => router.push('/auth/complete')}
              className="btn-primary w-full"
            >
              정보 입력하러 가기
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary w-full mt-2"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
      {needsApproval && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-10">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <p className="text-lg mb-1">승인 대기 중</p>
            <h2 className="text-base font-bold mb-2">
              {pendingRequest ? requestedRoleLabel(pendingRequest) : '회원'} 권한 승인이 필요합니다
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              센터 직원이 회원 관리에서 권한을 승인하면 이 계정으로 이용할 수 있습니다.
            </p>
            {pendingRequest?.role === 'admin' && (
              <>
                <input
                  className="input mb-2"
                  type="password"
                  value={bootstrapCode}
                  onChange={e => setBootstrapCode(e.target.value)}
                  placeholder="관리자 초기 가입 코드"
                />
                <button
                  type="button"
                  onClick={handleBootstrapAdmin}
                  disabled={bootstrapLoading}
                  className="btn-primary w-full mb-2"
                >
                  {bootstrapLoading ? '확인 중...' : '최초 센터 직원 계정 만들기'}
                </button>
              </>
            )}
            <button
              onClick={async () => {
                await createClient().auth.refreshSession()
                window.location.reload()
              }}
              disabled={bootstrapLoading}
              className={pendingRequest?.role === 'admin' ? 'btn-secondary w-full' : 'btn-primary w-full'}
            >
              승인 상태 다시 확인
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary w-full mt-2"
            >
              로그아웃
            </button>
            {bootstrapError && <p className="text-xs text-red-500 mt-3">{bootstrapError}</p>}
          </div>
        </div>
      )}
      <div className={clsx('min-h-screen', isDesktopMode ? 'flex' : 'flex flex-col')}>
        {isDesktopMode && (
          <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-4">
            <Link href="/dashboard" className="mb-6 font-bold text-primary-700 text-xl">TFI</Link>
            <nav className="space-y-1">
              {visibleNav.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        )}

        <div className="flex min-h-screen flex-1 flex-col bg-white">
          <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 md:px-6 flex items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className={clsx('font-bold text-primary-700 text-lg shrink-0', isDesktopMode && 'md:hidden')}
            >
              TFI
            </Link>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              {me && (
                <span className="max-w-[96px] truncate text-xs text-gray-500 md:max-w-xs">
                  {me.name ?? me.role}
                </span>
              )}
              <div className="inline-flex shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs" aria-label="화면 모드">
                <button
                  type="button"
                  aria-pressed={!isDesktopMode}
                  onClick={() => handleLayoutModeChange('mobile')}
                  className={clsx(
                    'rounded-md px-2 py-1 font-medium transition-colors',
                    !isDesktopMode ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800',
                  )}
                >
                  모바일
                </button>
                <button
                  type="button"
                  aria-pressed={isDesktopMode}
                  onClick={() => handleLayoutModeChange('desktop')}
                  className={clsx(
                    'rounded-md px-2 py-1 font-medium transition-colors',
                    isDesktopMode ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800',
                  )}
                >
                  PC
                </button>
              </div>
              <Link href="/mypage" className="flex flex-col gap-1 p-1 rounded hover:bg-gray-100 transition-colors shrink-0" aria-label="마이페이지">
                <span className="block w-5 h-0.5 bg-gray-600 rounded" />
                <span className="block w-5 h-0.5 bg-gray-600 rounded" />
                <span className="block w-5 h-0.5 bg-gray-600 rounded" />
              </Link>
            </div>
          </header>

          {isDesktopMode && visibleNav.length > 0 && (
            <nav className="md:hidden border-b border-gray-100 bg-white px-4 py-2">
              <div className="flex gap-2 overflow-x-auto">
                {visibleNav.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium',
                      pathname.startsWith(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-500',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          <main className={clsx(
            'flex-1 overflow-y-auto',
            isDesktopMode ? 'px-4 py-5 md:px-6 md:py-6' : 'pb-20 px-4 pt-4',
          )}>
            {children}
          </main>
        </div>
      </div>

      {!isDesktopMode && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 flex justify-around z-10">
          {visibleNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center py-2 px-2 text-xs gap-0.5 flex-1',
                pathname.startsWith(item.href)
                  ? 'text-primary-600 font-semibold'
                  : 'text-gray-400',
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
