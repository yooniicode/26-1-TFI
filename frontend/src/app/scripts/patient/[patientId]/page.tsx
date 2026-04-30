'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import Spinner from '@/components/ui/Spinner'
import { scriptApi, patientApi, consultationApi } from '@/lib/api'
import type { MedicalScript, Patient, Consultation, ScriptType } from '@/lib/types'
import { SCRIPT_TYPES, useEnumLabels } from '@/lib/i18n/enumLabels'
import { useTranslation } from '@/lib/i18n/I18nContext'

export default function ScriptGeneratePage() {
  const { patientId } = useParams<{ patientId: string }>()
  const router = useRouter()
  const { t } = useTranslation()
  const labels = useEnumLabels()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [scripts, setScripts] = useState<MedicalScript[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({
    scriptType: 'GENERAL' as ScriptType,
    consultationId: '',
    additionalContext: '',
  })
  const [error, setError] = useState('')

  const loadScripts = useCallback(
    () => scriptApi.byPatient(patientId).then(r => setScripts(r.payload ?? [])),
    [patientId],
  )

  useEffect(() => {
    Promise.all([
      patientApi.get(patientId),
      consultationApi.byPatient(patientId),
      loadScripts(),
    ]).then(([pRes, cRes]) => {
      setPatient(pRes.payload)
      setConsultations(cRes.payload ?? [])
    }).finally(() => setLoading(false))
  }, [patientId, loadScripts])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setGenerating(true); setError('')
    try {
      await scriptApi.generate({
        patientId,
        consultationId: form.consultationId || null,
        scriptType: form.scriptType,
        additionalContext: form.additionalContext || null,
      })
      await loadScripts()
      setForm(f => ({ ...f, additionalContext: '' }))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <AppShell><Spinner /></AppShell>

  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="text-gray-400">←</button>
        <h1 className="text-lg font-bold">{t.script.title}</h1>
        {patient && <span className="text-sm text-gray-400">— {patient.name}</span>}
      </div>

      <form onSubmit={handleGenerate} className="card mb-4 space-y-3">
        <h2 className="font-semibold text-sm">{t.script.form_title}</h2>
        <div>
          <label className="label">{t.script.script_type}</label>
          <select className="input" value={form.scriptType}
            onChange={e => setForm(f => ({ ...f, scriptType: e.target.value as ScriptType }))}>
            {SCRIPT_TYPES.map(value => (
              <option key={value} value={value}>{labels.script[value]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t.script.ref_consultation}</label>
          <select className="input" value={form.consultationId}
            onChange={e => setForm(f => ({ ...f, consultationId: e.target.value }))}>
            <option value="">{t.script.ref_auto}</option>
            {consultations.map(c => (
              <option key={c.id} value={c.id}>
                {c.consultationDate} — {c.hospitalName ?? t.script.no_hospital}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t.script.additional_context}</label>
          <textarea className="input resize-none min-h-[60px]"
            placeholder={t.script.additional_placeholder}
            value={form.additionalContext}
            onChange={e => setForm(f => ({ ...f, additionalContext: e.target.value }))} />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={generating}>
          {generating ? t.script.generating : t.script.generate_btn}
        </button>
      </form>

      <h2 className="font-semibold text-sm mb-2">{t.script.saved_scripts} ({scripts.length})</h2>
      {scripts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t.script.no_scripts}</p>
      ) : (
        <div className="space-y-2">
          {scripts.map(s => (
            <div key={s.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary-600">
                  {labels.script[s.scriptType]}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString(t.locale)}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">{s.contentKo}</p>
              <Link href={`/scripts/${s.id}/present`}
                className="mt-2 block text-center text-xs text-primary-600 hover:underline">
                {t.script.present_mode}
              </Link>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
