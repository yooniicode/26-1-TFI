import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import type { EmailOtpType } from '@supabase/supabase-js'

function loginRedirect(origin: string, error: string) {
  const url = new URL('/login', origin)
  url.searchParams.set('error', error)
  return NextResponse.redirect(url)
}

function classifyCallbackError(error?: { message?: string } | null, usedCodeFlow = false) {
  const message = error?.message?.toLowerCase() ?? ''
  if (
    usedCodeFlow &&
    (
      message.includes('code verifier') ||
      message.includes('verifier') ||
      message.includes('pkce') ||
      message.includes('flow state')
    )
  ) {
    return 'auth_link_browser_mismatch'
  }
  if (message.includes('expired') || message.includes('invalid') || message.includes('already')) {
    return 'auth_link_invalid'
  }
  return 'auth_callback_failed'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  const callbackError = searchParams.get('error') ?? searchParams.get('error_code')
  // Docker 내부 hostname 대신 브라우저가 실제 접속한 host 사용
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? 'localhost:3000'
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`

  if (callbackError) {
    return loginRedirect(origin, 'auth_link_invalid')
  }

  if (code || (token_hash && type)) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          },
        },
      },
    )

    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: token_hash!, type: type! })

    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      return NextResponse.redirect(`${origin}/auth/complete`)
    }

    return loginRedirect(origin, classifyCallbackError(error, !!code))
  }

  return loginRedirect(origin, 'auth_callback_failed')
}
