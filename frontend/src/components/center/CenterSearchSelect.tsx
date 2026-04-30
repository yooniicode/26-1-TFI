'use client'

import { useEffect, useState } from 'react'
import { centerApi } from '@/lib/api'
import type { Center } from '@/lib/types'

type CenterSearchSelectProps = {
  valueName?: string
  disabled?: boolean
  placeholder?: string
  onSelect: (center: Center) => void
}

export default function CenterSearchSelect({
  valueName,
  disabled,
  placeholder = '센터 검색',
  onSelect,
}: CenterSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(valueName ?? '')
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    let active = true
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      centerApi.list(query.trim() || undefined)
        .then(res => {
          if (active) setCenters(res.payload ?? [])
        })
        .catch(err => {
          console.error('Center search failed:', err)
          if (active) {
            setCenters([])
            setError('센터 검색에 실패했습니다.')
          }
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [open, query])

  function close() {
    setOpen(false)
    setQuery(valueName ?? '')
  }

  function selectCenter(center: Center) {
    onSelect(center)
    setOpen(false)
    setQuery(center.name)
  }

  return (
    <>
      <button
        type="button"
        className="input flex items-center justify-between gap-3 text-left disabled:bg-gray-50 disabled:text-gray-400"
        disabled={disabled}
        onClick={() => {
          setQuery(valueName ?? '')
          setOpen(true)
        }}
      >
        <span className={valueName ? 'truncate text-gray-800' : 'truncate text-gray-400'}>
          {valueName || placeholder}
        </span>
        <span className="flex-shrink-0 text-xs font-medium text-primary-600">검색</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-800">근무 센터 검색</h3>
              <button
                type="button"
                className="text-xl leading-none text-gray-400 hover:text-gray-700"
                onClick={close}
                aria-label="닫기"
              >
                x
              </button>
            </div>

            <input
              className="input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="센터명, 주소, 전화번호 검색"
              autoFocus
            />

            <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
              {loading ? (
                <p className="py-6 text-center text-xs text-gray-400">검색 중...</p>
              ) : error ? (
                <p className="py-6 text-center text-xs text-red-500">{error}</p>
              ) : centers.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-400">검색 결과가 없습니다.</p>
              ) : centers.map(center => (
                <button
                  key={center.id}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary-50 hover:text-primary-700"
                  onClick={() => selectCenter(center)}
                >
                  <span className="font-medium">{center.name}</span>
                  {center.address && (
                    <span className="mt-0.5 block truncate text-xs text-gray-400">{center.address}</span>
                  )}
                  {center.phone && (
                    <span className="mt-0.5 block text-xs text-gray-400">{center.phone}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
