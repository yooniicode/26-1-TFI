import { useTranslation } from '@/lib/i18n/I18nContext'
import type { Language } from '@/lib/i18n/I18nContext'
import { useCallback } from 'react'
// import { authApi } from '@/lib/api' // <- Potential usage for backend user preference sync

/**
 * Use Case Hook for managing application language and translations.
 * Encapsulates the logic so UI components only consume specific actions and state.
 */
export function useI18nUseCase() {
  const { lang, setLang, t } = useTranslation()

  // Use Case: Change Language
  const changeLanguage = useCallback((newLang: Language) => {
    setLang(newLang)
    // Future extension: If the user is logged in, you could sync this to the backend:
    // authApi.updateProfile({ preferredLanguage: newLang }).catch(console.error)
  }, [setLang])

  return {
    lang,
    t,
    changeLanguage,
  }
}
