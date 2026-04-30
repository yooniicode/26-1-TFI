'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppShell from '@/components/AppShell'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { centerApi } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { Center } from '@/lib/types'
import { useTranslation } from '@/lib/i18n/I18nContext'

export default function CentersPage() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [editing, setEditing] = useState<Center | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  const { data: centers = [], isLoading } = useQuery({
    queryKey: queryKeys.centers,
    queryFn: () => centerApi.list().then(r => r.payload ?? []),
  })

  useEffect(() => {
    if (!editing) return
    setName(editing.name)
    setAddress(editing.address ?? '')
    setPhone(editing.phone ?? '')
  }, [editing])

  const { mutate: saveCenter, isPending, error } = useMutation({
    mutationFn: () => {
      const body = {
        name: name.trim(),
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        active: true,
      }
      if (!body.name) return Promise.reject(new Error(t.center.err_name))
      return editing
        ? centerApi.update(editing.id, body)
        : centerApi.create(body)
    },
    onSuccess: () => {
      setEditing(null)
      setName('')
      setAddress('')
      setPhone('')
      queryClient.invalidateQueries({ queryKey: queryKeys.centers })
    },
  })

  if (isLoading) return <AppShell><Spinner /></AppShell>

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold">{t.center.title}</h1>
          <p className="text-xs text-gray-500 mt-1">{t.center.subtitle}</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); saveCenter() }} className="card space-y-3">
          <h2 className="font-semibold text-sm">{editing ? t.center.form_edit : t.center.form_create}</h2>
          <div>
            <label className="label">{t.center.name_label}</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder={t.center.name_placeholder} />
          </div>
          <div>
            <label className="label">{t.center.address_label}</label>
            <input className="input" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div>
            <label className="label">{t.center.phone_label}</label>
            <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.center.phone_placeholder} />
          </div>
          {error && <p className="text-xs text-red-500">{error instanceof Error ? error.message : t.center.err_save}</p>}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditing(null)
                setName('')
                setAddress('')
                setPhone('')
              }}
            >
              {t.center.reset}
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? t.common.saving : t.common.save}
            </button>
          </div>
        </form>

        {centers.length === 0 ? (
          <EmptyState message={t.center.empty} />
        ) : (
          <div className="space-y-2">
            {centers.map(center => (
              <button
                key={center.id}
                type="button"
                onClick={() => setEditing(center)}
                className="card block w-full text-left hover:border-primary-200 transition-colors"
              >
                <p className="text-sm font-semibold">{center.name}</p>
                {center.address && <p className="text-xs text-gray-400 mt-1">{center.address}</p>}
                {center.phone && <p className="text-xs text-gray-400">{center.phone}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
