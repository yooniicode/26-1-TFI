'use client'

import { useI18nUseCase } from '@/hooks/useI18nUseCase'
import type { Language } from '@/lib/i18n/I18nContext'

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useI18nUseCase()

  return (
    <select
      value={lang}
      onChange={(e) => changeLanguage(e.target.value as Language)}
      className="input py-1 px-2 text-xs w-auto bg-transparent border-gray-200 text-gray-500"
    >
      <option value="ko">한국어 (KO)</option>
      <option value="en">English (EN)</option>
      <option value="vi">Tiếng Việt (VI)</option>
    </select>
  )
}

