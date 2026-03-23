import { useState } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'
import clsx from 'clsx'

const BENEFITS = [
  'Review multilingual tickets from one workspace',
  'Audit AI drafts before they reach Freshdesk',
  'Track compliance, spam, and performance in one flow',
]

const INITIAL_FORM = { name: '', email: '', password: '' }

const SOCIAL_OPTIONS = [
  { id: 'google',   label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
]

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.7 2.5 12 2.5A9.5 9.5 0 1 0 12 21.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12Z" />
      <path fill="#34A853" d="M3.7 7.9l3.2 2.3C7.7 8 9.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.7 2.5 12 2.5c-3.6 0-6.7 2.1-8.3 5.4Z" />
      <path fill="#FBBC05" d="M12 21.5c2.6 0 4.7-.9 6.3-2.5l-3-2.4c-.8.6-1.8 1-3.3 1-3.8 0-5.2-2.6-5.4-3.9l-3.2 2.4A9.5 9.5 0 0 0 12 21.5Z" />
      <path fill="#4285F4" d="M21.1 12.3c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.4-1.1 2.5-2.1 3.2l3 2.4c1.7-1.6 2.8-4 2.8-7.9Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  )
}

const SOCIAL_ICONS = { google: GoogleIcon, facebook: FacebookIcon }

export default function Auth({ mode, onModeChange, onAuthenticate }) {
  const [form, setForm]     = useState(INITIAL_FORM)
  const [focused, setFocused] = useState(null)
  const isSignup = mode === 'signup'

  const handleChange = (key, value) => setForm(c => ({ ...c, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const fallbackName    = form.email.split('@')[0] || 'Sara'
    const isAdminLogin    = form.email.trim().toLowerCase() === 'admin@test.com' && form.password === 'admin123'
    onAuthenticate({
      name:  isSignup ? form.name || fallbackName : fallbackName,
      email: form.email,
      role:  isAdminLogin ? 'admin' : 'agent',
    })
  }

  const handleSocialAuth = (provider) => {
    const providerName = provider === 'google' ? 'Google User' : 'Facebook User'
    const domain       = provider === 'google' ? 'gmail.com'  : 'facebookmail.com'
    onAuthenticate({
      name:  providerName,
      email: `${providerName.toLowerCase().replace(/\s+/g, '.')}@${domain}`,
      role:  'agent',
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080810] flex items-center justify-center px-4 py-10">

      {/* ── Background ambient glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-emerald-600/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[140px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }}
        />
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 xl:grid-cols-[1fr_420px] rounded-[2rem] border border-white/[0.08] bg-white/[0.02] shadow-[0_32px_96px_rgba(0,0,0,0.6)] backdrop-blur-sm overflow-hidden">

        {/* ── LEFT: Brand panel ── */}
        <div className="relative flex flex-col justify-between p-10 border-b border-white/[0.07] xl:border-b-0 xl:border-r">
          {/* Vertical accent line */}
          <div className="absolute left-0 top-16 bottom-16 w-px bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent" />

          {/* Logo */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">Qiki AI Ops</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium tracking-wide uppercase">Beta</span>
            </div>

            <h1 className="font-display text-[2.6rem] font-bold tracking-tight leading-[1.1] text-white max-w-sm">
              AI operations for<br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                multilingual teams.
              </span>
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-400 max-w-sm">
              Monitor live queues, refine AI responses, and manage operational risk across email, chat, voice, and webforms.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-10 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-4">What's included</p>
            {BENEFITS.map((b, i) => (
              <div key={b} className="flex items-start gap-3 group">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          {/* Bottom hint */}
          <p className="mt-10 text-[11px] text-slate-600">
            Mock auth only · <span className="text-slate-500 font-mono">admin@test.com</span> / <span className="text-slate-500 font-mono">admin123</span> for admin
          </p>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="flex flex-col justify-center p-8 bg-black/20">

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl mb-8">
            {[['signin', 'Sign in'], ['signup', 'Sign up']].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onModeChange(value)}
                className={clsx(
                  'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200',
                  mode === value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isSignup ? 'Create your workspace' : 'Welcome back'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              {isSignup
                ? 'Set up team access and continue into the platform.'
                : 'Use any mock credentials to enter the workspace.'}
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 mb-6">
            {SOCIAL_OPTIONS.map(option => {
              const Icon = SOCIAL_ICONS[option.id]
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSocialAuth(option.id)}
                  aria-label={`Continue with ${option.label}`}
                  className="flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-slate-300 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <Icon />
                  {option.label}
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">or with email</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — always in DOM, height-reserved, invisible when signin */}
            <div className={clsx('transition-opacity duration-200', isSignup ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
              <Field
                label="Full name"
                icon={UserRound}
                value={form.name}
                onChange={v => handleChange('name', v)}
                placeholder="Sara Rahman"
                focused={focused === 'name'}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </div>

            <Field
              label="Email address"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={v => handleChange('email', v)}
              placeholder="sara@qiki.ai"
              required
              focused={focused === 'email'}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />

            <Field
              label="Password"
              icon={LockKeyhole}
              type="password"
              value={form.password}
              onChange={v => handleChange('password', v)}
              placeholder="Enter password"
              required
              focused={focused === 'password'}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold text-white transition-all shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_32px_rgba(99,102,241,0.5)] mt-2"
            >
              {isSignup ? 'Create account' : 'Sign in to workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] text-slate-600 leading-relaxed">
            By continuing you agree to our{' '}
            <span className="text-slate-400 underline underline-offset-2 cursor-pointer hover:text-slate-200 transition-colors">Terms</span>
            {' '}and{' '}
            <span className="text-slate-400 underline underline-offset-2 cursor-pointer hover:text-slate-200 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, focused, onFocus, onBlur }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <div className={clsx(
        'relative flex items-center rounded-xl border transition-all duration-150',
        focused
          ? 'border-indigo-500/60 bg-indigo-500/[0.06] ring-2 ring-indigo-500/20'
          : 'border-white/[0.08] bg-white/[0.04] hover:border-white/[0.14]'
      )}>
        <Icon className={clsx('absolute left-3.5 w-4 h-4 transition-colors', focused ? 'text-indigo-400' : 'text-slate-500')} />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full bg-transparent py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none"
        />
      </div>
    </label>
  )
}
