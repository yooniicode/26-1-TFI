'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { consultationApi, patientApi, hospitalApi } from '@/lib/api'
import type { ConsultationMethod, Hospital, IssueType, Patient, ProcessingType } from '@/lib/types'
import {
  CONSULTATION_METHODS,
  ISSUE_TYPES,
  PROCESSING_TYPES,
  useEnumLabels,
} from '@/lib/i18n/enumLabels'
import { useTranslation } from '@/lib/i18n/I18nContext'

export default function NewConsultationPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const labels = useEnumLabels()
  const [patients, setPatients] = useState<Patient[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    consultationDate: today,
    patientId: '',
    hospitalId: '',
    department: '',
    doctorName: '',
    issueType: 'MEDICAL' as IssueType,
    method: '' as '' | ConsultationMethod,
    processing: 'INTERPRETATION' as ProcessingType,
    patientComment: '',
    treatmentResult: '',
    diagnosisContent: '',
    diagnosisNameCode: '',
    medicationInstruction: '',
    nextAppointmentDate: '',
    counselorName: '',
    durationHours: '',
    fee: '',
    workDescription: '',
    doctorConfirmationSignature: '',
    memo: '',
  })

  useEffect(() => {
    Promise.all([patientApi.list(), hospitalApi.search()])
      .then(([p, h]) => {
        setPatients(p.payload ?? [])
        setHospitals(h.payload ?? [])
      })
  }, [])

  const selectedPatient = useMemo(
    () => patients.find(p => p.id === form.patientId),
    [patients, form.patientId],
  )

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.patientId) { setError(t.consultation.err_patient); return }
    setSubmitting(true)
    setError('')
    try {
      await consultationApi.create({
        ...form,
        hospitalId: form.hospitalId || null,
        method: form.method || null,
        durationHours: form.durationHours ? Number(form.durationHours) : null,
        fee: form.fee ? Number(form.fee) : null,
        nextAppointmentDate: form.nextAppointmentDate || null,
      })
      router.push('/consultations')
    } catch (e) {
      setError(e instanceof Error ? e.message : t.consultation.err_save)
      setSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="text-gray-400">←</button>
        <h1 className="text-lg font-bold">{t.consultation.new_title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600">{t.consultation.section_basic}</h2>
          <div>
            <label className="label">{t.consultation.visit_date}</label>
            <input
              type="date"
              className="input"
              value={form.consultationDate}
              onChange={e => set('consultationDate', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">{t.consultation.patient}</label>
            <select
              className="input"
              value={form.patientId}
              onChange={e => set('patientId', e.target.value)}
              required
            >
              <option value="">{t.consultation.patient_placeholder}</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
              <p className="font-medium text-gray-700 mb-1">{selectedPatient.name}</p>
              <p>
                {labels.nationality[selectedPatient.nationality]} · {labels.gender[selectedPatient.gender]} · {labels.visa[selectedPatient.visaType]}
              </p>
              <p>
                {[selectedPatient.birthDate, selectedPatient.region, selectedPatient.phone]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
          )}

          <div>
            <label className="label">{t.consultation.hospital}</label>
            <select
              className="input"
              value={form.hospitalId}
              onChange={e => set('hospitalId', e.target.value)}
            >
              <option value="">{t.consultation.hospital_placeholder}</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">{t.consultation.department}</label>
              <input
                className="input"
                value={form.department}
                onChange={e => set('department', e.target.value)}
                placeholder={t.consultation.department_placeholder}
              />
            </div>
            <div>
              <label className="label">{t.consultation.doctor}</label>
              <input
                className="input"
                value={form.doctorName}
                onChange={e => set('doctorName', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600">{t.consultation.section_patient_report}</h2>
          <div>
            <label className="label">{t.consultation.diagnosis_code}</label>
            <input
              className="input"
              value={form.diagnosisNameCode}
              onChange={e => set('diagnosisNameCode', e.target.value)}
              placeholder={t.consultation.diagnosis_code_placeholder}
            />
          </div>
          <FieldTextArea
            label={t.consultation.diagnosis_content}
            value={form.diagnosisContent}
            onChange={v => set('diagnosisContent', v)}
          />
          <FieldTextArea
            label={t.consultation.treatment_result}
            value={form.treatmentResult}
            onChange={v => set('treatmentResult', v)}
          />
          <FieldTextArea
            label={t.consultation.medication}
            value={form.medicationInstruction}
            onChange={v => set('medicationInstruction', v)}
            placeholder={t.consultation.medication_placeholder}
          />
          <div>
            <label className="label">{t.consultation.next_appointment_date}</label>
            <input
              type="date"
              className="input"
              value={form.nextAppointmentDate}
              onChange={e => set('nextAppointmentDate', e.target.value)}
            />
          </div>
          <FieldTextArea
            label={t.consultation.patient_comment}
            value={form.patientComment}
            onChange={v => set('patientComment', v)}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600">{t.consultation.section_work_log}</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">{t.consultation.issue_type}</label>
              <select
                className="input"
                value={form.issueType}
                onChange={e => set('issueType', e.target.value)}
              >
                {ISSUE_TYPES.map(value => (
                  <option key={value} value={value}>{labels.issue[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{t.consultation.interp_method}</label>
              <select
                className="input"
                value={form.method}
                onChange={e => set('method', e.target.value)}
              >
                <option value="">{t.consultation.select_placeholder}</option>
                {CONSULTATION_METHODS.map(value => (
                  <option key={value} value={value}>{labels.method[value]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">{t.consultation.processing}</label>
              <select
                className="input"
                value={form.processing}
                onChange={e => set('processing', e.target.value)}
              >
                {PROCESSING_TYPES.map(value => (
                  <option key={value} value={value}>{labels.processing[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{t.consultation.counselor}</label>
              <input
                className="input"
                value={form.counselorName}
                onChange={e => set('counselorName', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">{t.consultation.duration}</label>
              <input
                type="number"
                step="0.5"
                className="input"
                value={form.durationHours}
                onChange={e => set('durationHours', e.target.value)}
                placeholder={t.consultation.duration_placeholder}
              />
            </div>
            <div>
              <label className="label">{t.consultation.fee}</label>
              <input
                type="number"
                className="input"
                value={form.fee}
                onChange={e => set('fee', e.target.value)}
                placeholder={t.consultation.fee_placeholder}
              />
            </div>
          </div>
          <FieldTextArea
            label={t.consultation.work_description}
            value={form.workDescription}
            onChange={v => set('workDescription', v)}
          />
          <FieldTextArea
            label={t.consultation.memo}
            value={form.memo}
            onChange={v => set('memo', v)}
          />
          <FieldTextArea
            label={t.consultation.doctor_signature}
            value={form.doctorConfirmationSignature}
            onChange={v => set('doctorConfirmationSignature', v)}
            placeholder={t.consultation.doctor_signature_placeholder}
          />
        </section>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? t.consultation.saving : t.consultation.save_two}
        </button>
      </form>
    </AppShell>
  )
}

function FieldTextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        className="input min-h-24 resize-none"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
