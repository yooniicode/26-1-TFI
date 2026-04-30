'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import PasswordInput from '@/components/ui/PasswordInput'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    
    if (!password) {
      setError('새 비밀번호를 입력해주세요.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card max-w-sm w-full text-center py-10">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="font-bold text-lg mb-2">비밀번호가 변경되었습니다</h2>
          <p className="text-sm text-gray-500 mb-6">
            잠시 후 대시보드로 이동합니다.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary w-full"
          >
            대시보드로 이동
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary-700">비밀번호 재설정</h1>
          <p className="text-sm text-gray-500 mt-1">새로운 비밀번호를 입력해주세요.</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="label">새 비밀번호</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="8자 이상"
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="label">비밀번호 확인</label>
            <PasswordInput
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="비밀번호 확인"
              required
              autoComplete="new-password"
            />
            {passwordConfirm && (
              <p className={`text-xs mt-1 ${password === passwordConfirm ? 'text-green-600' : 'text-red-500'}`}>
                {password === passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  )
}
