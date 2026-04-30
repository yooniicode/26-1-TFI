'use client'

import { useTranslation } from '@/lib/i18n/I18nContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation()

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className="input py-1 px-2 text-xs w-auto bg-transparent border-gray-200 text-gray-500"
    >
      <option value="ko">한국어 (KO)</option>
      <option value="en">English (EN)</option>
      <option value="vi">Tiếng Việt (VI)</option>
    </select>
  )
}
