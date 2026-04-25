'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import type { Gender, InterpreterRole, Nationality, UserRole, VisaType } from '@/lib/types'

export default function AuthCompletePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)

  const [name, setName] = useState('')
  const [role, setRole] = useState<Extract<UserRole, 'interpreter' | 'patient'>>('patient')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState<Nationality>('OTHER')
  const [gender, setGender] = useState<Gender>('OTHER')
  const [visaType, setVisaType] = useState<VisaType>('OTHER')
  const [interpreterRole, setInterpreterRole] = useState<InterpreterRole>('FREELANCER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    authApi.me()
      .then(() => router.replace('/dashboard'))
      .catch(() => setNeedsProfile(true))
      .finally(() => setChecking(false))
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('이름을 입력해주세요.'); return }
    setLoading(true); setError('')
    try {
      await authApi.registerProfile({
        name: name.trim(),
        phone: phone || undefined,
        nationality: role === 'patient' ? nationality : undefined,
        gender: role === 'patient' ? gender : undefined,
        visaType: role === 'patient' ? visaType : undefined,
        interpreterRole: role === 'interpreter' ? interpreterRole : undefined,
      })
      router.replace('/dashboard')
    } catch (e) {
      setError(e instanceof Error ? e.message : '프로필 저장에 실패했습니다.')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">잠시만요...</p>
      </div>
    )
  }

  if (!needsProfile) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-primary-700">프로필 설정</h1>
          <p className="text-sm text-gray-500 mt-1">처음 로그인하셨군요! 정보를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">이름</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름"
              required
            />
          </div>

          <div>
            <label className="label">역할</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'patient', label: '이주민', desc: '의료·법률 통번역 지원이 필요해요' },
                { value: 'interpreter', label: '통번역가', desc: '통번역 활동가·프리랜서·센터직원' },
              ] as const).map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`rounded-lg border-2 p-3 text-left transition-colors ${
                    role === value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-sm font-semibold ${role === value ? 'text-primary-700' : 'text-gray-700'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">연락처(선택)</label>
            <input
              type="text"
              className="input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          {role === 'patient' && (
            <>
              <div>
                <label className="label">국적</label>
                <select className="input" value={nationality} onChange={e => setNationality(e.target.value as Nationality)}>
                  <option value="VIETNAM">베트남</option>
                  <option value="CHINA">중국</option>
                  <option value="CAMBODIA">캄보디아</option>
                  <option value="MYANMAR">미얀마</option>
                  <option value="PHILIPPINES">필리핀</option>
                  <option value="INDONESIA">인도네시아</option>
                  <option value="THAILAND">태국</option>
                  <option value="NEPAL">네팔</option>
                  <option value="MONGOLIA">몽골</option>
                  <option value="UZBEKISTAN">우즈베키스탄</option>
                  <option value="SRI_LANKA">스리랑카</option>
                  <option value="BANGLADESH">방글라데시</option>
                  <option value="PAKISTAN">파키스탄</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
              <div>
                <label className="label">성별</label>
                <select className="input" value={gender} onChange={e => setGender(e.target.value as Gender)}>
                  <option value="MALE">남</option>
                  <option value="FEMALE">여</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
              <div>
                <label className="label">비자</label>
                <select className="input" value={visaType} onChange={e => setVisaType(e.target.value as VisaType)}>
                  <option value="E9">E-9</option>
                  <option value="E6">E-6</option>
                  <option value="F1">F-1</option>
                  <option value="F2">F-2</option>
                  <option value="F4">F-4</option>
                  <option value="F5">F-5</option>
                  <option value="F6">F-6</option>
                  <option value="H2">H-2</option>
                  <option value="D2">D-2</option>
                  <option value="U">미등록</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
            </>
          )}

          {role === 'interpreter' && (
            <div>
              <label className="label">통번역가 구분</label>
              <select className="input" value={interpreterRole} onChange={e => setInterpreterRole(e.target.value as InterpreterRole)}>
                <option value="ACTIVIST">통번역활동가</option>
                <option value="FREELANCER">프리랜서</option>
                <option value="STAFF">센터직원</option>
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '저장 중...' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
