'use client'

import { useQuery } from '@tanstack/react-query'
import AppShell from '@/components/AppShell'
import { consultationApi } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import { useMe } from '@/hooks/useMe'
import type { Consultation } from '@/lib/types'
import { useEnumLabels } from '@/lib/i18n/enumLabels'
import { useTranslation } from '@/lib/i18n/I18nContext'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'

export default function DashboardPage() {
  const { data: me, isLoading: meLoading } = useMe()
  const { t } = useTranslation()
  const labels = useEnumLabels()
  const canViewConsultations = me?.role === 'admin' || me?.role === 'interpreter'

  const { data: consultations, isLoading: listLoading } = useQuery({
    queryKey: queryKeys.consultations.list(0),
    queryFn: () => consultationApi.list(0).then(r => (r.payload ?? []) as Consultation[]),
    enabled: canViewConsultations,
  })

  if (meLoading || (canViewConsultations && listLoading)) return <AppShell><Spinner /></AppShell>

  const recent = (consultations ?? []).slice(0, 5)

  const roleLabel =
    me?.role === 'admin' ? t.dashboard.role_admin
    : me?.role === 'interpreter' ? t.dashboard.role_interpreter
    : t.dashboard.role_patient

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">
            {t.dashboard.welcome(me?.name ?? '')}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{roleLabel}</p>
        </div>

        {me?.role === 'interpreter' && (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/consultations/new" className="card flex flex-col items-center py-5 gap-2 hover:border-primary-300 transition-colors">
              <span className="text-3xl">📝</span>
              <span className="text-sm font-medium">{t.dashboard.write_report}</span>
            </Link>
            <Link href="/handovers" className="card flex flex-col items-center py-5 gap-2 hover:border-primary-300 transition-colors">
              <span className="text-3xl">🔄</span>
              <span className="text-sm font-medium">{t.dashboard.handover}</span>
            </Link>
          </div>
        )}

        {me?.role === 'admin' && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { href: '/consultations', label: t.nav.consultations, icon: '📝' },
              { href: '/matching', label: t.nav.matching, icon: '🔀' },
              { href: '/interpreters', label: t.nav.interpreters, icon: '🧑‍💼' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="card flex flex-col items-center py-4 gap-1 text-center hover:border-primary-300">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {me?.role === 'patient' && (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/my-records" className="card flex flex-col items-center py-5 gap-2 hover:border-primary-300">
              <span className="text-3xl">📋</span>
              <span className="text-sm font-medium">{t.dashboard.my_records}</span>
            </Link>
            {me.entityId && (
              <Link href={`/scripts/patient/${me.entityId}`} className="card flex flex-col items-center py-5 gap-2 hover:border-primary-300">
                <span className="text-3xl">💬</span>
                <span className="text-sm font-medium">{t.dashboard.medical_scripts}</span>
              </Link>
            )}
          </div>
        )}

        {canViewConsultations && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">{t.dashboard.recent_reports}</h2>
              <Link href="/consultations" className="text-sm text-primary-600">{t.dashboard.view_all}</Link>
            </div>
            <div className="space-y-2">
              {recent.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">{t.dashboard.no_reports}</p>
              )}
              {recent.map(c => (
                <Link key={c.id} href={`/consultations/${c.id}`} className="card flex items-center gap-3 hover:border-primary-200 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.patientName}</p>
                    <p className="text-xs text-gray-400">{c.consultationDate} · {labels.issue[c.issueType]}</p>
                  </div>
                  {c.confirmed
                    ? <Badge variant="green">{t.common.confirmed}</Badge>
                    : <Badge variant="yellow">{t.common.unconfirmed}</Badge>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
