export const LANGS = ['uz', 'ru', 'en'] as const

export type Lang = (typeof LANGS)[number]

export const LANGUAGE_STORAGE_KEY = 'ilgor.studios.lang'

export const LANGUAGE_OPTIONS: Array<{ code: Lang; flagSrc: string; label: string; shortLabel: string }> = [
  { code: 'uz', flagSrc: 'https://flagcdn.com/w40/uz.png', label: "O'zbek", shortLabel: 'UZ' },
  { code: 'ru', flagSrc: 'https://flagcdn.com/w40/ru.png', label: 'Русский', shortLabel: 'RU' },
  { code: 'en', flagSrc: 'https://flagcdn.com/w40/gb.png', label: 'English', shortLabel: 'ENG' },
]

export const translations = {
  uz: {
    brand: { title: "Ilg'or studios", subtitle: 'IT kompaniya' },
    nav: {
      services: 'Xizmatlar',
      pricing: 'Paketlar',
      process: 'Jarayon',
      faq: 'FAQ',
      contact: 'Aloqa',
      pricingShort: 'Paketlar',
      contactShort: "Bog'lanish",
      languageLabel: 'Til',
    },
    hero: {
      pills: ['⚡ Tez, chiroyli, stabil', '🎯 Biznesga yo‘naltirilgan UI/UX', '🔒 Xavfsizlik + SEO'],
      titleBefore: "Ilg'or studios bilan g‘oyani",
      titleAccent: 'ishlaydigan',
      titleAfter: 'mahsulotga aylantiring.',
      desc: 'Biz web sayt, landing, admin panel va biznes jarayonlarini avtomatlashtiruvchi web-yechimlar qilamiz. Maqsad bitta: dizayn chiroyli bo‘lsin, tez ishlasin va sotuv/so‘rov olib kelsin.',
      primary: 'Paketlar va muddat',
      secondary: 'Xizmatlar',
      stats: [
        { k: '7-21 kun', v: 'Ko‘p loyihalar muddati' },
        { k: 'Aniq plan', v: 'Bosqichma-bosqich topshirish' },
        { k: 'Toza kod', v: 'Performance + SEO asoslari' },
      ],
    },
    services: {
      eyebrow: 'XIZMATLAR',
      title: 'Bitta jamoa - to‘liq yechim.',
      subtitle:
        'Sizga kerak bo‘lgan hammasi: dizayn, frontend, backend, integratsiya, SEO va deploy. Biz har bir bosqichda sifatni nazorat qilamiz.',
      cards: [
        { title: 'Landing va korporativ sayt', desc: 'Konversiya, tezlik, SEO, animatsiya va premium ko‘rinish.' },
        { title: 'Web-app va admin panel', desc: 'Role-based access, dashboard, analytics, integratsiyalar.' },
        { title: 'UI/UX dizayn + brand', desc: 'Figma dizayn, design-system, prototip va user-flow.' },
        { title: 'API va integratsiya', desc: 'Telegram bot, payment, CRM, ERP, Google services.' },
        { title: 'Performance va Security', desc: 'Core Web Vitals, optimizatsiya, xavfsiz konfiguratsiya.' },
        { title: 'Texnik support', desc: 'Monitoring, update, kontent, A/B test va iteratsiya.' },
      ],
      cardBadge: 'Tayyor natija + aniq deadline',
    },
    pricing: {
      eyebrow: 'PAKETLAR',
      title: 'Tushunarli paketlar. Moslashuvchan shartlar.',
      subtitle:
        'Har bir paketda: dizayn, moslashuvchan layout, SEO asoslari va deploy bor. Narx/muddat loyiha hajmiga qarab aniqlanadi.',
      priceLabel: 'Narx',
      sendRequest: "So'rov yuborish",
      process: 'Jarayon',
      plans: [
        {
          name: 'Start',
          tag: 'Landing / promo-sahifa',
          time: '7-10 kun',
          price: 'Kelishiladi',
          points: ['1 sahifa (hero + sectionlar)', 'Adaptiv (mobile/desktop)', 'Kontakt/so‘rov CTA'],
        },
        {
          name: 'Business',
          tag: 'Korporativ sayt',
          time: '10-18 kun',
          price: 'Kelishiladi',
          points: ['3-7 sahifa', 'CMS yoki admin (ixtiyoriy)', 'Integratsiya: Telegram/Email'],
        },
        {
          name: 'Pro',
          tag: 'Web-app / admin panel',
          time: '14-30 kun',
          price: 'Kelishiladi',
          points: ['Auth + rollar', 'Dashboard + CRUD', 'Deploy + monitoring'],
        },
      ],
    },
    process: {
      eyebrow: 'JARAYON',
      title: 'Soddalashtirilgan, lekin professional.',
      subtitle: 'Biz siz bilan bir xil tilda gaplashamiz: maqsad -> yechim -> natija. Har bosqichda demo va aniqlik bo‘ladi.',
      steps: [
        { t: '1) Talablarni aniqlash', d: 'Maqsad, auditoriya, sahifalar tarkibi, integratsiya va deadline.' },
        { t: '2) Dizayn + prototip', d: 'Figma: hero, sectionlar, komponentlar, animatsiya g‘oyasi.' },
        { t: '3) Development + launch', d: 'React/Tailwind, optimizatsiya, SEO, deploy va support.' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Ko‘p so‘raladigan savollar.',
      subtitle: 'Qisqa va aniq javoblar. Agar savolingiz boshqacha bo‘lsa, yozing - tezda yo‘naltiramiz.',
      items: [
        {
          q: 'Narx qanday hisoblanadi?',
          a: 'Sahifalar soni, funksiyalar (admin, auth, integratsiya), dizayn murakkabligi va muddatga qarab aniqlanadi.',
        },
        {
          q: 'Muddat qancha bo‘ladi?',
          a: 'Landing odatda 7-10 kun. Korporativ sayt 10-18 kun. Web-app 14-30 kun (scopega bog‘liq).',
        },
        {
          q: 'Domen/hostingni kim qiladi?',
          a: 'Xohlasangiz, sizga mos variantni tanlashda yordam beramiz va deployni o‘zimiz qilib beramiz.',
        },
        {
          q: 'Keyin support bormi?',
          a: 'Ha. Launchdan keyin texnik yordam va kichik o‘zgarishlar uchun support formatini kelishib olamiz.',
        },
      ],
    },
    contact: {
      eyebrow: 'ALOQA',
      title: 'Loyihani boshlaymizmi?',
      subtitle: 'Biz bilan bog‘laning: Telegram, email yoki telefon orqali. Odatda 24 soat ichida javob beramiz.',
      cardTitle: 'Aloqa',
      cardDesc: '1-2 gap bilan yozing: nima kerak, qaysi muddat, taxminiy byudjet (ixtiyoriy).',
      replyBadge: '24 soat ichida javob',
      detailsTitle: 'Nima yuborsangiz yetadi?',
      detailsDesc: 'Quyidagilardan 2-3 tasini yozsangiz, tezda aniq taklif va muddat aytamiz.',
      checklist: [
        'Sayt turi: landing / korporativ / web-app',
        'Kerakli sahifalar yoki funksiyalar (masalan: katalog, admin, payment)',
        'Deadline (qachonga kerak)',
        'Byudjet diapazoni (ixtiyoriy)',
      ],
      telegram: 'Telegram',
      email: 'Email',
      phone: 'Telefon',
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan.",
      top: 'Yuqoriga',
      contact: 'Aloqa',
    },
  },
  ru: {
    brand: { title: "Ilg'or studios", subtitle: 'IT компания' },
    nav: {
      services: 'Услуги',
      pricing: 'Пакеты',
      process: 'Процесс',
      faq: 'FAQ',
      contact: 'Контакты',
      pricingShort: 'Пакеты',
      contactShort: 'Связаться',
      languageLabel: 'Язык',
    },
    hero: {
      pills: ['⚡ Быстро, красиво, стабильно', '🎯 UI/UX с фокусом на бизнес', '🔒 Безопасность + SEO'],
      titleBefore: 'С Ilgor studios превратите идею',
      titleAccent: 'в рабочий',
      titleAfter: 'продукт.',
      desc: 'Делаем сайты, лендинги, админ-панели и веб-решения для автоматизации бизнес-процессов. Цель одна: красивый дизайн, высокая скорость и реальные заявки/продажи.',
      primary: 'Пакеты и сроки',
      secondary: 'Услуги',
      stats: [
        { k: '7-21 дней', v: 'Средний срок проектов' },
        { k: 'Четкий план', v: 'Поэтапная сдача работ' },
        { k: 'Чистый код', v: 'Основы performance + SEO' },
      ],
    },
    services: {
      eyebrow: 'УСЛУГИ',
      title: 'Одна команда - полное решение.',
      subtitle:
        'Все, что нужно вашему продукту: дизайн, frontend, backend, интеграции, SEO и deploy. Контролируем качество на каждом этапе.',
      cards: [
        { title: 'Лендинг и корпоративный сайт', desc: 'Конверсия, скорость, SEO, анимации и премиальный вид.' },
        { title: 'Web-app и админ-панель', desc: 'Role-based доступ, dashboard, аналитика, интеграции.' },
        { title: 'UI/UX дизайн + бренд', desc: 'Figma-дизайн, дизайн-система, прототип и user-flow.' },
        { title: 'API и интеграции', desc: 'Telegram-бот, payment, CRM, ERP, Google services.' },
        { title: 'Performance и безопасность', desc: 'Core Web Vitals, оптимизация, безопасная конфигурация.' },
        { title: 'Техподдержка', desc: 'Мониторинг, обновления, контент, A/B тесты и итерации.' },
      ],
      cardBadge: 'Готовый результат + четкий дедлайн',
    },
    pricing: {
      eyebrow: 'ПАКЕТЫ',
      title: 'Понятные пакеты. Гибкие условия.',
      subtitle:
        'В каждом пакете: дизайн, адаптивная верстка, SEO-основа и deploy. Стоимость и сроки зависят от объема проекта.',
      priceLabel: 'Цена',
      sendRequest: 'Оставить заявку',
      process: 'Процесс',
      plans: [
        {
          name: 'Start',
          tag: 'Лендинг / промо-страница',
          time: '7-10 дней',
          price: 'По договоренности',
          points: ['1 страница (hero + блоки)', 'Адаптив (mobile/desktop)', 'CTA для контакта/заявки'],
        },
        {
          name: 'Business',
          tag: 'Корпоративный сайт',
          time: '10-18 дней',
          price: 'По договоренности',
          points: ['3-7 страниц', 'CMS или админка (опционально)', 'Интеграции: Telegram/Email'],
        },
        {
          name: 'Pro',
          tag: 'Web-app / админ-панель',
          time: '14-30 дней',
          price: 'По договоренности',
          points: ['Auth + роли', 'Dashboard + CRUD', 'Deploy + monitoring'],
        },
      ],
    },
    process: {
      eyebrow: 'ПРОЦЕСС',
      title: 'Просто, но профессионально.',
      subtitle:
        'Говорим с вами на языке бизнеса: цель -> решение -> результат. На каждом этапе есть демо и прозрачность.',
      steps: [
        { t: '1) Уточняем требования', d: 'Цель, аудитория, структура страниц, интеграции и дедлайн.' },
        { t: '2) Дизайн + прототип', d: 'Figma: hero, секции, компоненты, идея анимаций.' },
        { t: '3) Development + запуск', d: 'React/Tailwind, оптимизация, SEO, deploy и support.' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Частые вопросы.',
      subtitle: 'Кратко и по делу. Если вопрос нестандартный - напишите, быстро подскажем.',
      items: [
        {
          q: 'Как рассчитывается стоимость?',
          a: 'Зависит от числа страниц, функционала (админка, auth, интеграции), сложности дизайна и сроков.',
        },
        {
          q: 'Какие сроки реализации?',
          a: 'Лендинг обычно 7-10 дней. Корпоративный сайт 10-18 дней. Web-app 14-30 дней (зависит от scope).',
        },
        {
          q: 'Кто занимается доменом и хостингом?',
          a: 'Поможем выбрать оптимальный вариант и полностью сделаем deploy при необходимости.',
        },
        {
          q: 'Есть ли поддержка после запуска?',
          a: 'Да. После launch согласуем формат техподдержки и мелких доработок.',
        },
      ],
    },
    contact: {
      eyebrow: 'КОНТАКТЫ',
      title: 'Начнем проект?',
      subtitle: 'Свяжитесь с нами через Telegram, email или телефон. Обычно отвечаем в течение 24 часов.',
      cardTitle: 'Связь',
      cardDesc: 'Напишите 1-2 предложениями: что нужно, какой срок, примерный бюджет (по желанию).',
      replyBadge: 'Ответ в течение 24 часов',
      detailsTitle: 'Что достаточно отправить?',
      detailsDesc: 'Если напишете 2-3 пункта из списка, сразу дадим точное предложение и сроки.',
      checklist: [
        'Тип сайта: landing / корпоративный / web-app',
        'Нужные страницы или функции (например: каталог, админка, payment)',
        'Дедлайн (к какой дате нужно)',
        'Диапазон бюджета (по желанию)',
      ],
      telegram: 'Telegram',
      email: 'Email',
      phone: 'Телефон',
    },
    footer: {
      rights: 'Все права защищены.',
      top: 'Наверх',
      contact: 'Контакты',
    },
  },
  en: {
    brand: { title: "Ilg'or studios", subtitle: 'IT company' },
    nav: {
      services: 'Services',
      pricing: 'Packages',
      process: 'Process',
      faq: 'FAQ',
      contact: 'Contact',
      pricingShort: 'Packages',
      contactShort: 'Contact',
      languageLabel: 'Language',
    },
    hero: {
      pills: ['⚡ Fast, polished, stable', '🎯 Business-focused UI/UX', '🔒 Security + SEO'],
      titleBefore: 'Turn your idea into a',
      titleAccent: 'working',
      titleAfter: 'product with Ilgor studios.',
      desc: 'We build websites, landing pages, admin panels, and web solutions that automate business workflows. One goal: beautiful design, fast performance, and real leads/sales.',
      primary: 'Packages and timeline',
      secondary: 'Services',
      stats: [
        { k: '7-21 days', v: 'Typical project timeline' },
        { k: 'Clear plan', v: 'Step-by-step delivery' },
        { k: 'Clean code', v: 'Performance + SEO basics' },
      ],
    },
    services: {
      eyebrow: 'SERVICES',
      title: 'One team - complete solution.',
      subtitle:
        'Everything your project needs: design, frontend, backend, integrations, SEO, and deploy. We keep quality high at every stage.',
      cards: [
        { title: 'Landing and corporate websites', desc: 'Conversion, speed, SEO, animation, and premium look.' },
        { title: 'Web apps and admin panels', desc: 'Role-based access, dashboards, analytics, integrations.' },
        { title: 'UI/UX design + brand', desc: 'Figma design, design system, prototypes, and user flows.' },
        { title: 'API and integrations', desc: 'Telegram bot, payment, CRM, ERP, Google services.' },
        { title: 'Performance and security', desc: 'Core Web Vitals, optimization, secure configuration.' },
        { title: 'Technical support', desc: 'Monitoring, updates, content, A/B testing, and iteration.' },
      ],
      cardBadge: 'Ready result + clear deadline',
    },
    pricing: {
      eyebrow: 'PACKAGES',
      title: 'Clear packages. Flexible terms.',
      subtitle:
        'Every package includes design, responsive layout, SEO basics, and deploy. Pricing and timeline depend on project scope.',
      priceLabel: 'Price',
      sendRequest: 'Send request',
      process: 'Process',
      plans: [
        {
          name: 'Start',
          tag: 'Landing / promo page',
          time: '7-10 days',
          price: 'Negotiable',
          points: ['1 page (hero + sections)', 'Responsive (mobile/desktop)', 'Contact/request CTA'],
        },
        {
          name: 'Business',
          tag: 'Corporate website',
          time: '10-18 days',
          price: 'Negotiable',
          points: ['3-7 pages', 'CMS or admin panel (optional)', 'Integrations: Telegram/Email'],
        },
        {
          name: 'Pro',
          tag: 'Web app / admin panel',
          time: '14-30 days',
          price: 'Negotiable',
          points: ['Auth + roles', 'Dashboard + CRUD', 'Deploy + monitoring'],
        },
      ],
    },
    process: {
      eyebrow: 'PROCESS',
      title: 'Simple, yet professional.',
      subtitle: 'We align with your business language: goal -> solution -> outcome. Every stage is clear and demo-based.',
      steps: [
        { t: '1) Requirements discovery', d: 'Goals, audience, page structure, integrations, and deadline.' },
        { t: '2) Design + prototype', d: 'Figma: hero, sections, components, animation concepts.' },
        { t: '3) Development + launch', d: 'React/Tailwind, optimization, SEO, deploy, and support.' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions.',
      subtitle: 'Short and clear answers. If your case is different, message us and we will guide you quickly.',
      items: [
        {
          q: 'How is pricing calculated?',
          a: 'It depends on number of pages, functionality (admin, auth, integrations), design complexity, and timeline.',
        },
        {
          q: 'What is the typical timeline?',
          a: 'Landing pages are usually 7-10 days. Corporate sites 10-18 days. Web apps 14-30 days (scope-dependent).',
        },
        {
          q: 'Who handles domain/hosting?',
          a: 'We can help choose the best option and fully handle deployment for you.',
        },
        {
          q: 'Do you provide post-launch support?',
          a: 'Yes. After launch we agree on a support format for technical help and small updates.',
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACT',
      title: 'Ready to start your project?',
      subtitle: 'Reach us via Telegram, email, or phone. We usually reply within 24 hours.',
      cardTitle: 'Contact',
      cardDesc: 'Send 1-2 lines: what you need, preferred timeline, and approximate budget (optional).',
      replyBadge: 'Reply within 24 hours',
      detailsTitle: 'What should you send?',
      detailsDesc: 'Share any 2-3 points below and we can provide a clear proposal and timeline quickly.',
      checklist: [
        'Website type: landing / corporate / web app',
        'Required pages or features (e.g., catalog, admin panel, payment)',
        'Deadline (when it is needed)',
        'Budget range (optional)',
      ],
      telegram: 'Telegram',
      email: 'Email',
      phone: 'Phone',
    },
    footer: {
      rights: 'All rights reserved.',
      top: 'Back to top',
      contact: 'Contact',
    },
  },
} as const
