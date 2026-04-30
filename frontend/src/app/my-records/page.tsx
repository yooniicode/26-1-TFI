'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { authApi, patientApi, scriptApi } from '@/lib/api'
import type { AuthMe, MedicalScript, PatientReport } from '@/lib/types'
import { useEnumLabels } from '@/lib/i18n/enumLabels'
import { useTranslation } from '@/lib/i18n/I18nContext'

export default function MyRecordsPage() {
  const { t } = useTranslation()
  const labels = useEnumLabels()
  const [me, setMe] = useState<AuthMe | null>(null)
  const [records, setRecords] = useState<PatientReport[]>([])
  const [scripts, setScripts] = useState<MedicalScript[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.me().then(meRes => {
      setMe(meRes.payload)
      const patientId = meRes.payload.entityId
      if (!patientId) { setLoading(false); return }
      Promise.all([
        patientApi.myRecords(patientId),
        scriptApi.byPatient(patientId),
      ]).then(([rRes, sRes]) => {
        setRecords(rRes.payload ?? [])
        setScripts(sRes.payload ?? [])
      }).finally(() => setLoading(false))
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <AppShell><Spinner /></AppShell>

  return (
    <AppShell>
      <h1 className="text-lg font-bold mb-4">{t.my_records.title}</h1>

      <section className="mb-5">
        <h2 className="font-semibold text-sm text-gray-600 mb-2">{t.my_records.patient_records_section}</h2>
        {records.length === 0 ? (
          <EmptyState message={t.my_records.no_records} />
        ) : (
          <div className="space-y-2">
            {records.map(c => (
              <div key={c.id} className="card">
                <p className="text-sm font-medium">{c.consultationDate}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {c.hospitalName ?? t.my_records.no_hospital}
                  {c.department && ` · ${c.department}`}
                  {c.doctorName && ` · ${c.doctorName}`}
                </p>
                {c.diagnosisNameCode && (
                  <p className="text-sm mt-3 font-medium">{t.my_records.diagnosis_label}: {c.diagnosisNameCode}</p>
                )}
                {c.diagnosisContent && (
                  <InfoBlock label={t.my_records.diagnosis_content} value={c.diagnosisContent} />
                )}
                {c.treatmentResult && (
                  <InfoBlock label={t.my_records.treatment_result} value={c.treatmentResult} />
                )}
                {c.medicationInstruction && (
                  <InfoBlock label={t.my_records.medication} value={c.medicationInstruction} />
                )}
                {c.nextAppointmentDate && (
                  <p className="text-xs text-primary-600 mt-3">
                    {t.my_records.next_appointment}: {c.nextAppointmentDate}
                  </p>
                )}
                {c.patientComment && (
                  <InfoBlock label={t.my_records.patient_comment} value={c.patientComment} />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-sm text-gray-600">{t.my_records.scripts_section}</h2>
          {me?.entityId && (
            <Link href={`/scripts/patient/${me.entityId}`} className="text-xs text-primary-600">
              {t.my_records.new_script}
            </Link>
          )}
        </div>
        {scripts.length === 0 ? (
          <EmptyState message={t.my_records.no_scripts} />
        ) : (
          <div className="space-y-2">
            {scripts.map(s => (
              <div key={s.id} className="card">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-primary-600 font-medium">
                    {labels.script[s.scriptType]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(s.createdAt).toLocaleDateString(t.locale)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{s.contentKo}</p>
                <Link
                  href={`/scripts/${s.id}/present`}
                  className="mt-2 block text-center py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium"
                >
                  {t.my_records.show_doctor}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm whitespace-pre-wrap">{value}</p>
    </div>
  )
}
