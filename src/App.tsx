import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Mail, Phone, Send, Sparkles } from 'lucide-react'
import { Background } from './components/Background'
import { AdminPanel } from './features/monitoring/AdminPanel'
import { ConsentCaptureWidget } from './features/monitoring/ConsentCaptureWidget'
import { LANGS, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY, type Lang, translations } from './i18n/translations'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, duration: 0.5, ease: EASE },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100/80">
      {children}
    </span>
  )
}

function PrimaryLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_70px_rgba(99,102,241,0.35)] transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </a>
  )
}

function GhostLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100/85 transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      {children}
    </a>
  )
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-4 py-20 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-10"
      >
        <div className="mb-3 text-xs font-semibold tracking-[0.22em] text-cyan-200/70">
          {eyebrow}
        </div>
        <h2 className="text-balance text-3xl font-semibold text-slate-50 md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-slate-200/70 md:text-base">
          {subtitle}
        </p>
      </motion.div>
      {children}
    </section>
  )
}

export default function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const [lang, setLang] = useState<Lang>(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return LANGS.includes(saved as Lang) ? (saved as Lang) : 'uz'
  })

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = translations[lang]

  if (isAdminRoute) {
    return <AdminPanel />
  }

  return (
    <div className="relative">
      <Background />

      {/* Nav */}
      <div className="sticky top-0 z-20 border-b border-white/6 bg-slate-950/30 backdrop-blur supports-backdrop-filter:bg-slate-950/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="#top" className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/6 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-cyan-200/80" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-50">{t.brand.title}</div>
              <div className="text-[11px] text-slate-200/55">{t.brand.subtitle}</div>
            </div>
          </a>

          <div className="hidden items-center gap-6 text-sm text-slate-200/70 md:flex">
            <a className="hover:text-slate-50" href="#services">
              {t.nav.services}
            </a>
            <a className="hover:text-slate-50" href="#pricing">
              {t.nav.pricing}
            </a>
            <a className="hover:text-slate-50" href="#process">
              {t.nav.process}
            </a>
            <a className="hover:text-slate-50" href="#faq">
              {t.nav.faq}
            </a>
            <a className="hover:text-slate-50" href="#contact">
              {t.nav.contact}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl border border-white/12 bg-slate-900/70 p-1 backdrop-blur-xl">
                {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLang(option.code)}
                  aria-label={`${t.nav.languageLabel}: ${option.label}`}
                  className={`group relative overflow-hidden rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition ${
                    option.code === lang
                      ? 'bg-linear-to-r from-cyan-300/25 to-indigo-300/25 text-white ring-1 ring-cyan-200/45'
                      : 'text-slate-200/80 hover:bg-white/8 hover:text-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <img
                      src={option.flagSrc}
                      alt={option.label}
                      className="h-3.5 w-5 rounded-[2px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{option.shortLabel}</span>
                  </span>
                </button>
              ))}
            </div>
            <a
              className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100/80 transition hover:bg-white/8 md:inline-flex"
              href="#pricing"
            >
              {t.nav.pricingShort}
            </a>
            <a
              className="rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
              href="#contact"
            >
              {t.nav.contactShort}
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-16 md:px-6 md:pb-24 md:pt-24">
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <motion.div variants={item} className="mb-6 flex flex-wrap gap-2">
            {t.hero.pills.map((pill) => (
              <Pill key={pill}>{pill}</Pill>
            ))}
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-semibold tracking-tight text-slate-50 md:text-6xl"
          >
            {t.hero.titleBefore}{' '}
            <span className="bg-linear-to-r from-cyan-200 to-indigo-200 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>{' '}
            {t.hero.titleAfter}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-200/72 md:text-base"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryLink href="#pricing">{t.hero.primary}</PrimaryLink>
            <GhostLink href="#services">{t.hero.secondary}</GhostLink>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/4 p-5 md:grid-cols-3"
          >
            {t.hero.stats.map((s) => (
              <div key={s.k} className="rounded-2xl bg-white/3 p-4 ring-1 ring-white/8">
                <div className="text-xl font-semibold text-slate-50">{s.k}</div>
                <div className="mt-1 text-xs text-slate-200/65">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </header>

      <Section
        id="services"
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        subtitle={t.services.subtitle}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {t.services.cards.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass rounded-3xl p-5 ring-1 ring-white/10"
            >
              <div className="text-base font-semibold text-slate-50">{c.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-200/70">{c.desc}</div>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-100/70">
                <CheckCircle2 className="h-4 w-4 text-cyan-200/70" />
                {t.services.cardBadge}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section
        id="pricing"
        eyebrow={t.pricing.eyebrow}
        title={t.pricing.title}
        subtitle={t.pricing.subtitle}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {t.pricing.plans.map((p) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="group glass relative overflow-hidden rounded-3xl p-6 ring-1 ring-white/10"
            >
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/16 blur-2xl transition group-hover:bg-indigo-500/22" />
              <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/12 blur-2xl transition group-hover:bg-cyan-500/18" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-50">{p.name}</div>
                    <div className="mt-1 text-xs text-slate-200/60">{p.tag}</div>
                  </div>
                  <Pill>{p.time}</Pill>
                </div>

                <div className="mt-5 rounded-2xl bg-white/4 p-4 ring-1 ring-white/8">
                  <div className="text-xs text-slate-200/60">{t.pricing.priceLabel}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-50">{p.price}</div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-200/70">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200/70" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <PrimaryLink href="#contact">{t.pricing.sendRequest}</PrimaryLink>
                  <GhostLink href="#process">{t.pricing.process}</GhostLink>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section
        id="process"
        eyebrow={t.process.eyebrow}
        title={t.process.title}
        subtitle={t.process.subtitle}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {t.process.steps.map((s) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass rounded-3xl p-5 ring-1 ring-white/10"
            >
              <div className="text-sm font-semibold text-slate-50">{s.t}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-200/70">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section
        id="faq"
        eyebrow={t.faq.eyebrow}
        title={t.faq.title}
        subtitle={t.faq.subtitle}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {t.faq.items.map((f) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass rounded-3xl p-5 ring-1 ring-white/10"
            >
              <details className="group">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <span>{f.q}</span>
                    <span className="text-slate-200/50 transition group-open:rotate-45">+</span>
                  </div>
                </summary>
                <div className="mt-3 text-sm leading-relaxed text-slate-200/70">{f.a}</div>
              </details>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section
        id="contact"
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass relative overflow-hidden rounded-3xl p-7 ring-1 ring-white/10">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/14 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-50">{t.contact.cardTitle}</div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-200/70">{t.contact.cardDesc}</div>
                </div>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100/80">
                  {t.contact.replyBadge}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href="https://t.me/lazyswe"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                      <Send className="h-5 w-5 text-cyan-200/80" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-200/60 transition group-hover:translate-x-0.5 group-hover:text-slate-50" />
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-50">{t.contact.telegram}</div>
                  <div className="mt-1 text-xs text-slate-200/65">@lazyswe</div>
                </a>

                <a
                  href="mailto:hello@ilgor.studio"
                  className="group rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                      <Mail className="h-5 w-5 text-cyan-200/80" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-200/60 transition group-hover:translate-x-0.5 group-hover:text-slate-50" />
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-50">{t.contact.email}</div>
                  <div className="mt-1 text-xs text-slate-200/65">hello@ilgor.studio</div>
                </a>

                <a
                  href="tel:+998901581881"
                  className="group rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                      <Phone className="h-5 w-5 text-cyan-200/80" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-200/60 transition group-hover:translate-x-0.5 group-hover:text-slate-50" />
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-50">{t.contact.phone}</div>
                  <div className="mt-1 text-xs text-slate-200/65">+998 (90) 158 18 81</div>
                </a>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-7 ring-1 ring-white/10">
            <div className="text-lg font-semibold text-slate-50">{t.contact.detailsTitle}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-200/70">{t.contact.detailsDesc}</div>
            <ul className="mt-5 space-y-3 text-sm text-slate-200/70">
              {t.contact.checklist.map((check) => (
                <li key={check} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200/70" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <footer className="border-t border-white/6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-slate-200/60 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            © {new Date().getFullYear()} Ilg'or studios. {t.footer.rights}
          </div>
          <div className="flex items-center gap-4">
            <a className="hover:text-slate-50" href="#top">
              {t.footer.top}
            </a>
            <a className="hover:text-slate-50" href="#contact">
              {t.footer.contact}
            </a>
          </div>
        </div>
      </footer>
      <ConsentCaptureWidget />
    </div>
  )
}
