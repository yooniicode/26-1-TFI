import type { AppTranslation } from '@/lib/i18n/ko'
import type { UserRole } from '@/lib/types'

export interface NavItem {
  href: string
  label: string
  icon: string
  roles: UserRole[]
}

export function getNavItems(t: AppTranslation): NavItem[] {
  return [
    { href: '/dashboard',          label: t.nav.home,             icon: '⌂', roles: ['admin', 'interpreter', 'patient'] },
    { href: '/consultations',      label: t.nav.consultations,    icon: '□', roles: ['admin', 'interpreter'] },
    { href: '/patients',           label: t.nav.patients,         icon: '◇', roles: ['admin', 'interpreter'] },
    { href: '/handovers',          label: t.nav.handovers,        icon: '↔', roles: ['admin', 'interpreter'] },
    { href: '/matching',           label: t.nav.matching,         icon: '◎', roles: ['admin'] },
    { href: '/interpreters',       label: t.nav.interpreters,     icon: '▣', roles: ['admin'] },
    { href: '/members',            label: t.nav.members,          icon: '○', roles: ['admin'] },
    { href: '/consultations/new',  label: t.nav.new_consultation, icon: '✎', roles: ['interpreter'] },
    { href: '/my-records',         label: t.nav.my_records,       icon: '□', roles: ['patient'] },
  ]
}
