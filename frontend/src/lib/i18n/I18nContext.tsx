'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ko } from './ko'
import { en } from './en'
import { vi } from './vi'
import type { AppTranslation } from './ko'

export type Language = 'ko' | 'en' | 'vi'

const dictionaries: Record<Language, AppTranslation> = { ko, en, vi }

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: AppTranslation
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ko')

  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as Language
    if (saved && dictionaries[saved]) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('app-lang', newLang)
    // Optional: Sync to Supabase user metadata if logged in
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within an I18nProvider')
  return ctx
}
