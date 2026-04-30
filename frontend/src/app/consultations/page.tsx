'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { consultationApi, authApi } from '@/lib/api'
import type { Consultation, AuthMe } from '@/lib/types'
import { useEnumLabels } from '@/lib/i18n/enumLabels'
import { useTranslation } from '@/lib/i18n/I18nContext'

type SortBy = 'consultationDate' | 'createdAt' | 'updatedAt'
type SortDirection = 'asc' | 'desc'

export default function ConsultationsPage() {
  const { t } = useTranslation()
  const labels = useEnumLabels()
  const [items, setItems] = useState<Consultation[]>([])
  const [me, setMe] = useState<AuthMe | null>(null)
  const [loading, setLoading] = useState(true)
  const [patientQuery, setPatientQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('consultationDate')
  const [direction, setDirection] = useState<SortDirection>('desc')

  const sortLabels: Record<SortBy, string> = {
    consultationDate: t.consultation.sort_visit,
    createdAt: t.consultation.sort_created,
    updatedAt: t.consultation.sort_updated,
  }

  useEffect(() => {
    setLoading(true)
    authApi.me()
      .then(meRes => {
        setMe(meRes.payload)
        return consultationApi.list({ page: 0, patientQuery, sortBy, direction })
      })
      .then(cRes => setItems(cRes.payload ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [patientQuery, sortBy, direction])

  function toggleDirection() {
    setDirection(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  if (loading) return <AppShell><Spinner /></AppShell>

  return (
    <AppShell>
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold">{t.consultation.title}</h1>
            {me?.role === 'admin' && (
              <p className="mt-0.5 text-xs text-gray-500">{t.consultation.admin_note}</p>
            )}
          </div>
          {me?.role === 'interpreter' && (
            <Link href="/consultations/new" className="btn-primary text-sm py-1.5 px-3">
              {t.consultation.write}
            </Link>
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-3">
          <input
            className="input"
            value={patientQuery}
            onChange={e => setPatientQuery(e.target.value)}
            placeholder={t.consultation.search_placeholder}
          />
          <div className="flex flex-wrap items-center gap-2">
            {(Object.entries(sortLabels) as [SortBy, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  sortBy === value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-500'
                }`}
                onClick={() => setSortBy(value)}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600"
              onClick={toggleDirection}
            >
              {direction === 'desc' ? t.consultation.sort_desc : t.consultation.sort_asc}
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState message={t.consultation.empty} />
      ) : (
        <div className="space-y-2">
          {items.map(c => (
            <Link
              key={c.id}
              href={`/consultations/${c.id}`}
              className="card block hover:border-primary-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{c.patientName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.consultationDate}
                    {c.hospitalName && ` · ${c.hospitalName}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{labels.issue[c.issueType]}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t.consultation.written_by}: {c.createdByName ?? c.interpreterName ?? '-'}
                    {c.createdAt && ` · ${t.consultation.written_at}: ${formatDateTime(c.createdAt, t.locale)}`}
                  </p>
                </div>
                {c.confirmed
                  ? <Badge variant="green">{t.common.confirmed}</Badge>
                  : <Badge variant="yellow">{t.common.unconfirmed}</Badge>}
              </div>
              {c.nextAppointmentDate && (
                <p className="text-xs text-primary-600 mt-2">
                  {t.consultation.next_appointment}: {c.nextAppointmentDate}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  )
}

function formatDateTime(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
