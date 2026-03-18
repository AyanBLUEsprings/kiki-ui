export const tickets = [
  { id: '#10482', subject: 'Package not delivered after 3 weeks — urgent birthday gift', category: 'Delivery Issue', lang: 'Arabic', age: '2h ago', status: 'pending', confidence: 82, urgency: 'high', channel: 'Email', folder: 'Inbox' },
  { id: '#10481', subject: 'Refund request for cancelled order #ORD-8821', category: 'Refund Request', lang: 'Turkish', age: '4h ago', status: 'pending', confidence: 91, urgency: 'medium', channel: 'Webforms', folder: 'Refunds' },
  { id: '#10480', subject: 'Color mismatch on embroidered logo patches', category: 'Quality Complaint', lang: 'Arabic', age: '5h ago', status: 'review', confidence: 74, urgency: 'medium', channel: 'Chat', folder: 'Needs Review' },
  { id: '#10479', subject: 'New order inquiry — bulk pricing for 500+ units', category: 'New Order', lang: 'French', age: '6h ago', status: 'pending', confidence: 88, urgency: 'low', channel: 'Voice', folder: 'VIP' },
  { id: '#10477', subject: 'Congratulations! You have won a cash prize', category: '—', lang: 'English', age: '8h ago', status: 'spam', confidence: 94, urgency: 'none', channel: 'Email', folder: 'Spam Queue' },
  { id: '#10475', subject: 'Payment confirmation for invoice #INV-2241', category: 'Payment', lang: 'Arabic', age: '1d ago', status: 'approved', confidence: 97, urgency: 'low', channel: 'Webforms', folder: 'Inbox' },
  { id: '#10471', subject: 'Design update request — new logo for spring collection', category: 'Design Update', lang: 'Turkish', age: '1d ago', status: 'approved', confidence: 89, urgency: 'low', channel: 'Chat', folder: 'VIP' },
  { id: '#10468', subject: 'Delivery issue — wrong items received in order', category: 'Delivery Issue', lang: 'Arabic', age: '2d ago', status: 'approved', confidence: 92, urgency: 'medium', channel: 'Voice', folder: 'Escalations' },
]

export const spamTickets = [
  { id: '#10477', subject: "Congratulations! You've won a cash prize", type: 'Spam Content', score: 94, received: '8h ago', domain: 'prizewin99.com', channel: 'Email', folder: 'Spam Queue' },
  { id: '#10462', subject: 'LIMITED TIME: 80% off luxury watches', type: 'Promotional', score: 88, received: '1d ago', domain: 'dealstoday.net', channel: 'Webforms', folder: 'Spam Queue' },
  { id: '#10455', subject: 'Automated inquiry system test #44821', type: 'Bot Traffic', score: 71, received: '2d ago', domain: 'testbot.io', channel: 'Chat', folder: 'Spam Queue' },
  { id: '#10448', subject: 'Make $5000/day working from home!', type: 'Spam Content', score: 97, received: '3d ago', domain: 'earnfast.biz', channel: 'Voice', folder: 'Spam Queue' },
  { id: '#10441', subject: 'Urgent: verify your account information', type: 'Phishing', score: 91, received: '4d ago', domain: 'secure-verify.xyz', channel: 'Email', folder: 'Spam Queue' },
]

export const weeklyTrend = [
  { day: 'Mon', resolved: 28, pending: 6, spam: 2 },
  { day: 'Tue', resolved: 34, pending: 9, spam: 3 },
  { day: 'Wed', resolved: 22, pending: 5, spam: 1 },
  { day: 'Thu', resolved: 41, pending: 11, spam: 4 },
  { day: 'Fri', resolved: 31, pending: 8, spam: 2 },
  { day: 'Sat', resolved: 15, pending: 3, spam: 1 },
  { day: 'Sun', resolved: 9,  pending: 2, spam: 0 },
]

export const categoryData = [
  { name: 'Delivery',  value: 38, color: '#6366f1' },
  { name: 'Refund',    value: 24, color: '#8b5cf6' },
  { name: 'Quality',   value: 18, color: '#06b6d4' },
  { name: 'New Order', value: 12, color: '#10b981' },
  { name: 'Other',     value: 8,  color: '#94a3b8' },
]

export const languageData = [
  { lang: 'Arabic',  flag: '🇸🇦', pct: 72, tickets: 214, quality: 98, time: '1.2s', active: true },
  { lang: 'Turkish', flag: '🇹🇷', pct: 14, tickets: 42,  quality: 96, time: '1.4s', active: true },
  { lang: 'French',  flag: '🇫🇷', pct: 9,  tickets: 27,  quality: 94, time: '1.1s', active: true },
  { lang: 'German',  flag: '🇩🇪', pct: 3,  tickets: 9,   quality: 91, time: '1.6s', active: false },
  { lang: 'Spanish', flag: '🇪🇸', pct: 2,  tickets: 6,   quality: 89, time: '1.8s', active: false },
]

export const activityFeed = [
  { id: '#10482', msg: 'AI draft generated — awaiting approval', time: '2m ago', type: 'draft', channel: 'Email', folder: 'Inbox' },
  { id: '#10480', msg: 'Revision applied · sent to Freshdesk', time: '14m ago', type: 'sent', channel: 'Chat', folder: 'Needs Review' },
  { id: '#10477', msg: 'Blocked — spam confidence 94%', time: '31m ago', type: 'spam', channel: 'Email', folder: 'Spam Queue' },
  { id: '#10475', msg: 'Approved and submitted to Freshdesk', time: '1h ago', type: 'approved', channel: 'Webforms', folder: 'Inbox' },
  { id: '#10471', msg: 'Arabic → English translation complete', time: '2h ago', type: 'translate', channel: 'Voice', folder: 'VIP' },
  { id: '#10468', msg: 'AI revision accepted · 1 round', time: '3h ago', type: 'approved', channel: 'Voice', folder: 'Escalations' },
  { id: '#10466', msg: 'New ticket received — quality complaint', time: '4h ago', type: 'draft', channel: 'Chat', folder: 'Needs Review' },
]

export const gdprRequests = [
  { id: '#DR-0041', type: 'Right to erasure', customer: 'Customer #8821', date: 'Mar 11', status: 'pending' },
  { id: '#DR-0040', type: 'Data portability export', customer: 'Customer #7612', date: 'Mar 10', status: 'pending' },
  { id: '#DR-0038', type: 'Access request — full history', customer: 'Customer #6204', date: 'Mar 8', status: 'done' },
  { id: '#DR-0037', type: 'Right to restrict processing', customer: 'Customer #5891', date: 'Mar 7', status: 'done' },
  { id: '#DR-0034', type: 'Data portability export', customer: 'Customer #4420', date: 'Mar 5', status: 'done' },
]

export const revisionHistory = [
  { round: 1, prompt: 'Make tone more formal', time: '12m ago', applied: true },
  { round: 2, prompt: 'Add stronger apology', time: '8m ago', applied: false },
]

const BASE_TICKET_DETAIL = {
  id: '#10482',
  subject: 'Package not delivered after 3 weeks',
  category: 'Delivery Issue',
  channel: 'Email',
  folder: 'Inbox',
  detectedLanguage: 'ar',
  languageLabel: 'Arabic',
  nativeDraft: `حضرة العميل المحترم،

نتقدم إليكم بأعمق اعتذاراتنا عن التأخير غير المقبول في توصيل طلبكم الكريم رقم #ORD-9912. نُحيطكم علمًا بأن فريقنا اللوجستي قد تولّى معالجة الأمر على وجه الاستعجال، وقد تم تحديد موقع طردكم في مركز التوزيع الإقليمي.

سيتم تسليم طردكم خلال 24-48 ساعة القادمة عبر خدمة التوصيل السريع. تعويضاً عن الإزعاج، نقدم لكم خصماً بنسبة 20% على طلبكم القادم (رمز: APOLOGY20).

مع فائق الاحترام،
فريق الدعم`,
  englishDraft: `Dear Valued Customer,

We sincerely apologise for the unacceptable delay in delivering your order #ORD-9912. Our logistics team has taken immediate action and located your parcel at our regional distribution centre.

Your package will be delivered within 24-48 hours via express courier. As compensation, we are applying a 20% discount to your next order (code: APOLOGY20).

Warm regards,
Support Team`,
  conversationNative: [
    { role: 'customer', time: 'Dec 10, 2:14 PM', text: 'لم أستلم طلبي حتى الآن رغم مرور 3 أسابيع. رقم الطلب: #ORD-9912. أرجو المساعدة بشكل عاجل فهو هدية لعيد الميلاد.' },
    { role: 'support',  time: 'Dec 10, 3:02 PM', text: 'شكراً لتواصلك معنا. نحن نتابع هذا الأمر فوراً.' },
    { role: 'customer', time: 'Dec 12, 9:47 AM', text: 'لا يزال لم يصل! هذا غير مقبول — الهدية لعيد الميلاد وقد فات الموعد.' },
    { role: 'support',  time: 'Dec 12, 11:00 AM', text: 'نعتذر جداً عن هذا التأخير. لقد تواصلنا مع شركة الشحن وسنرد عليك قريباً.' },
  ],
  conversationEnglish: [
    { role: 'customer', time: 'Dec 10, 2:14 PM', text: 'I still have not received my order after 3 weeks. Order number: #ORD-9912. Please help urgently because it is a birthday gift.' },
    { role: 'support',  time: 'Dec 10, 3:02 PM', text: 'Thank you for contacting us. We are looking into this right away.' },
    { role: 'customer', time: 'Dec 12, 9:47 AM', text: 'It still has not arrived. This is not acceptable. The birthday deadline has already passed.' },
    { role: 'support',  time: 'Dec 12, 11:00 AM', text: 'We are very sorry for the delay. We have contacted the carrier and will update you shortly.' },
  ],
  conversation: [
    { role: 'customer', time: 'Dec 10, 2:14 PM', text: 'لم أستلم طلبي حتى الآن رغم مرور 3 أسابيع. رقم الطلب: #ORD-9912. أرجو المساعدة بشكل عاجل فهو هدية لعيد الميلاد.' },
    { role: 'support',  time: 'Dec 10, 3:02 PM', text: 'شكراً لتواصلك معنا. نحن نتابع هذا الأمر فوراً.' },
    { role: 'customer', time: 'Dec 12, 9:47 AM', text: 'لا يزال لم يصل! هذا غير مقبول — الهدية لعيد الميلاد وقد فات الموعد.' },
    { role: 'support',  time: 'Dec 12, 11:00 AM', text: 'نعتذر جداً عن هذا التأخير. لقد تواصلنا مع شركة الشحن وسنرد عليك قريباً.' },
  ],
  summary: ['Order #ORD-9912 delayed 21+ days', 'Customer escalated twice', 'Birthday gift — time-sensitive', 'Located at regional hub'],
  actions: ['Expedite via express shipping', 'Apply 20% discount code APOLOGY20', 'Follow up in 48h'],
  validation: { ticketId: true, messages: true, supportRelated: true, notSpam: true },
  confidence: { resolution: 82, category: 95 },
  tags: ['delivery', 'urgent', 'escalated', 'gift'],
}

const CHANNEL_DETAIL_BY_TYPE = {
  Email: {},
  Chat: {
    id: '#10480',
    subject: 'Color mismatch on embroidered logo patches',
    category: 'Quality Complaint',
    channel: 'Chat',
    folder: 'Needs Review',
    detectedLanguage: 'ar',
    languageLabel: 'Arabic',
    nativeDraft: `مرحباً،\n\nنعتذر عن مشكلة اختلاف اللون في الشعار المطرز. راجعنا الصور المرسلة وفتحنا طلب استبدال عاجل للدفعة المتأثرة. سنرسل لك تأكيد الشحنة خلال 12 ساعة.\n\nمع الشكر،\nفريق الدعم`,
    englishDraft: `Hello,\n\nWe’re sorry about the color mismatch on the embroidered logo patches. We reviewed the images you shared and opened an urgent replacement request for the affected batch. We’ll send shipment confirmation within 12 hours.\n\nRegards,\nSupport Team`,
    conversationNative: [
      { role: 'customer', time: '10:12', text: 'مرحباً، وصلت رقع الشعار لكن اللون الأزرق أغمق بكثير من العينة المعتمدة.' },
      { role: 'support', time: '10:13', text: 'مفهوم. هل يمكنك رفع صورة مقرّبة من الأمام وأخرى من الجانب؟' },
      { role: 'customer', time: '10:14', text: 'تم الرفع الآن. هذا لفعالية عميل غداً لذلك أحتاج رداً سريعاً.' },
      { role: 'support', time: '10:16', text: 'شكراً. سأصعّد الحالة إلى فريق الجودة في الإنتاج وأتحقق من توفر الاستبدال الآن.' },
    ],
    conversationEnglish: [
      { role: 'customer', time: '10:12', text: 'Hi, the logo patches arrived but the blue is much darker than the approved sample.' },
      { role: 'support', time: '10:13', text: 'Understood. Can you upload one close-up image from the front and one from the side?' },
      { role: 'customer', time: '10:14', text: 'Uploaded now. This is for a client event tomorrow so I need a fast answer.' },
      { role: 'support', time: '10:16', text: 'Thanks. I am escalating this to production QA and checking replacement availability now.' },
    ],
    conversation: [
      { role: 'customer', time: '10:12', text: 'Hi, the logo patches arrived but the blue is much darker than the approved sample.' },
      { role: 'support', time: '10:13', text: 'Understood. Can you upload one close-up image from the front and one from the side?' },
      { role: 'customer', time: '10:14', text: 'Uploaded now. This is for a client event tomorrow so I need a fast answer.' },
      { role: 'support', time: '10:16', text: 'Thanks. I am escalating this to production QA and checking replacement availability now.' },
    ],
    summary: ['Customer reported shade mismatch in delivered logo patches', 'Image evidence provided in live chat', 'Client event tomorrow raises urgency', 'Replacement batch requested from production QA'],
    actions: ['Approve urgent replacement batch', 'Confirm courier dispatch within 12h', 'Offer prepaid return label for defective patches'],
    tags: ['quality', 'chat', 'replacement', 'urgent'],
  },
  Voice: {
    id: '#10479',
    subject: 'New order inquiry — bulk pricing for 500+ units',
    category: 'New Order',
    channel: 'Voice',
    folder: 'VIP',
    detectedLanguage: 'fr',
    languageLabel: 'French',
    nativeDraft: `Bonjour,\n\nMerci pour votre appel concernant votre commande en gros de plus de 500 unités. Nous avons transmis votre demande à notre équipe commerciale et nous reviendrons vers vous aujourd’hui avec une proposition tarifaire et un délai de production.\n\nCordialement,\nÉquipe support`,
    englishDraft: `Hello,\n\nThank you for your call regarding a bulk order of 500+ units. We’ve forwarded your request to our commercial team and will return today with pricing, production timing, and shipping options.\n\nBest regards,\nSupport Team`,
    conversationNative: [
      { role: 'agent', time: '00:00', text: 'Appel entrant connecté. Le client francophone demande un devis pour une commande en gros.' },
      { role: 'customer', time: '00:21', text: 'Nous avons besoin de 500 unités brodées avec livraison avant la première semaine d’avril.' },
      { role: 'agent', time: '01:10', text: 'MOQ, disponibilité du visuel et date limite confirmés. Un suivi avec devis aujourd’hui a été promis.' },
      { role: 'agent', time: '02:02', text: 'Appel terminé. Enregistrement joint et transfert à l’équipe commerciale demandé.' },
    ],
    conversationEnglish: [
      { role: 'agent', time: '00:00', text: 'Inbound voice call connected. French-speaking caller requesting bulk quote.' },
      { role: 'customer', time: '00:21', text: 'We need 500 embroidered units and delivery before the first week of April.' },
      { role: 'agent', time: '01:10', text: 'Confirmed MOQ, artwork readiness, and delivery deadline. Promised same-day quote follow-up.' },
      { role: 'agent', time: '02:02', text: 'Call ended. Recording attached and sales handoff requested.' },
    ],
    conversation: [
      { role: 'agent', time: '00:00', text: 'Inbound voice call connected. French-speaking caller requesting bulk quote.' },
      { role: 'customer', time: '00:21', text: 'We need 500 embroidered units and delivery before the first week of April.' },
      { role: 'agent', time: '01:10', text: 'Confirmed MOQ, artwork readiness, and delivery deadline. Promised same-day quote follow-up.' },
      { role: 'agent', time: '02:02', text: 'Call ended. Recording attached and sales handoff requested.' },
    ],
    callRecord: {
      duration: '02:02',
      queue: 'VIP Sales Line',
      agent: 'Sara R.',
      sentiment: 'Positive / urgent',
      disposition: 'Quote requested',
    },
    summary: ['Voice caller needs quote for 500+ units', 'Deadline before first week of April', 'Artwork is ready to send today', 'Sales handoff required for pricing'],
    actions: ['Create same-day pricing quote', 'Confirm production capacity', 'Assign sales owner for follow-up call'],
    tags: ['voice', 'sales', 'bulk-order', 'vip'],
  },
  Webforms: {
    id: '#10481',
    subject: 'Refund request for cancelled order #ORD-8821',
    category: 'Refund Request',
    channel: 'Webforms',
    folder: 'Refunds',
    detectedLanguage: 'tr',
    languageLabel: 'Turkish',
    nativeDraft: `Merhaba,\n\nİptal edilen #ORD-8821 siparişi için iade talebinizi aldık. Ödeme yönteminizi doğruladıktan sonra 3-5 iş günü içinde iadenizi başlatacağız.\n\nSaygılarımızla,\nDestek Ekibi`,
    englishDraft: `Hello,\n\nWe received your refund request for cancelled order #ORD-8821. Once we verify the original payment method, we will initiate the refund within 3-5 business days.\n\nKind regards,\nSupport Team`,
    conversation: [
      { role: 'system', time: 'Submitted', text: 'Refund request received through returns webform.' },
    ],
    webformNative: {
      'Siparis Numarasi': '#ORD-8821',
      'Neden': 'Musteri sevkiyat oncesinde iptal etti',
      'Iade Yontemi': '2048 ile biten orijinal kart',
      'Etkilenen Urunler': '2 islemeli kapusonlu sweatshirt',
      'Musteri Notu': 'Iade baslatildiginda lutfen onaylayin.',
    },
    webformEnglish: {
      'Order ID': '#ORD-8821',
      'Reason': 'Customer cancelled before dispatch',
      'Refund method': 'Original card ending 2048',
      'Items affected': '2 embroidered hoodies',
      'Customer note': 'Please confirm once refund is initiated.',
    },
    webform: {
      'Order ID': '#ORD-8821',
      'Reason': 'Customer cancelled before dispatch',
      'Refund method': 'Original card ending 2048',
      'Items affected': '2 embroidered hoodies',
      'Customer note': 'Please confirm once refund is initiated.',
    },
    summary: ['Refund requested through returns form', 'Order cancelled before dispatch', 'Original payment card identified', 'Awaiting payment verification before refund initiation'],
    actions: ['Verify payment token', 'Initiate refund to original method', 'Send refund confirmation email'],
    tags: ['webform', 'refund', 'payments'],
  },
}

export const TICKET_DETAIL = BASE_TICKET_DETAIL

export function getTicketDetail(ticket) {
  const channel = ticket?.channel ?? 'Email'
  const channelDetail = CHANNEL_DETAIL_BY_TYPE[channel] ?? CHANNEL_DETAIL_BY_TYPE.Email
  return {
    ...BASE_TICKET_DETAIL,
    ...channelDetail,
    ...ticket,
  }
}

// ── Analytics mock data ────────────────────────────────────────────────────

export const volumeTrend = [
  { day: 'Mon', total: 48, auto_resolved: 31, escalated: 9, failed: 2, spam: 6 },
  { day: 'Tue', total: 61, auto_resolved: 44, escalated: 11, failed: 1, spam: 5 },
  { day: 'Wed', total: 39, auto_resolved: 26, escalated: 7, failed: 3, spam: 3 },
  { day: 'Thu', total: 74, auto_resolved: 56, escalated: 13, failed: 2, spam: 3 },
  { day: 'Fri', total: 55, auto_resolved: 39, escalated: 10, failed: 1, spam: 5 },
  { day: 'Sat', total: 22, auto_resolved: 17, escalated: 3, failed: 1, spam: 1 },
  { day: 'Sun', total: 14, auto_resolved: 11, escalated: 2, failed: 0, spam: 1 },
]

export const latencyTrend = [
  { day: 'Mon', p50: 1.2, p95: 3.8, p99: 6.1, avg: 1.7 },
  { day: 'Tue', p50: 1.1, p95: 3.4, p99: 5.7, avg: 1.5 },
  { day: 'Wed', p50: 1.4, p95: 4.2, p99: 7.3, avg: 2.0 },
  { day: 'Thu', p50: 1.0, p95: 3.1, p99: 5.2, avg: 1.4 },
  { day: 'Fri', p50: 1.3, p95: 3.9, p99: 6.4, avg: 1.8 },
  { day: 'Sat', p50: 0.9, p95: 2.8, p99: 4.6, avg: 1.2 },
  { day: 'Sun', p50: 0.8, p95: 2.5, p99: 4.1, avg: 1.1 },
]

export const tokenTrend = [
  { day: 'Mon', input: 18400, output: 6200, total: 24600 },
  { day: 'Tue', input: 23100, output: 7800, total: 30900 },
  { day: 'Wed', input: 14800, output: 5100, total: 19900 },
  { day: 'Thu', input: 28700, output: 9400, total: 38100 },
  { day: 'Fri', input: 21200, output: 7100, total: 28300 },
  { day: 'Sat', input: 8600,  output: 2900, total: 11500 },
  { day: 'Sun', input: 5200,  output: 1800, total:  7000 },
]

export const resolutionTypes = [
  { type: 'Auto-Resolved',    count: 224, pct: 62, color: '#10b981' },
  { type: 'Needs Human',      count: 71,  pct: 20, color: '#6366f1' },
  { type: 'Escalated',        count: 55,  pct: 15, color: '#f59e0b' },
  { type: 'Needs More Info',  count: 9,   pct: 2,  color: '#8b5cf6' },
  { type: 'Spam',             count: 4,   pct: 1,  color: '#ef4444' },
]

export const piiTypes = [
  { type: 'Email Address',   count: 182, pct: 68 },
  { type: 'Phone Number',    count: 104, pct: 39 },
  { type: 'Full Name',       count: 97,  pct: 36 },
  { type: 'Street Address',  count: 41,  pct: 15 },
  { type: 'Credit Card',     count: 18,  pct:  7 },
  { type: 'IP Address',      count: 11,  pct:  4 },
]

export const revisionsByCategory = [
  { category: 'Delivery Issue',    total: 98,  revised: 41, rate: 42 },
  { category: 'Refund Request',    total: 74,  revised: 22, rate: 30 },
  { category: 'Quality Complaint', total: 58,  revised: 28, rate: 48 },
  { category: 'New Order',         total: 44,  revised: 6,  rate: 14 },
  { category: 'Design Update',     total: 39,  revised: 12, rate: 31 },
  { category: 'Payment',           total: 30,  revised: 3,  rate: 10 },
]

export const overviewKPIs = {
  totalTickets: 313,
  totalRuns: 471,
  autoResolutionRate: 71.6,
  avgCostPerRun: 0.0024,
  avgCostPerTicket: 0.0041,
  avgRunsPerTicket: 1.5,
  spamRate: 3.8,
  errorRate: 1.4,
  escalationRate: 15.2,
  avgConfidence: 87.4,
  revisionsRate: 28.3,
  p50: 1.1,
  p95: 3.7,
  avgResponse: 1.6,
}

// ── GDPR mock data ────────────────────────────────────────────────────────────

export const gdprAuditLog = {
  vault_access_audit: [
    { timestamp: '2026-03-13T09:12:00Z', access_type: 'READ', vault_entry_id: 'VLT-0441', processing_purpose: 'Ticket resolution', requested_by: 'ai_agent', risk_level: 'LOW' },
    { timestamp: '2026-03-12T14:33:00Z', access_type: 'READ', vault_entry_id: 'VLT-0438', processing_purpose: 'Refund processing', requested_by: 'agent_sara', risk_level: 'MEDIUM' },
    { timestamp: '2026-03-12T11:05:00Z', access_type: 'WRITE', vault_entry_id: 'VLT-0435', processing_purpose: 'Data rectification', requested_by: 'dpo_admin', risk_level: 'HIGH' },
  ],
  ai_processing_log: [
    { timestamp: '2026-03-13T09:14:00Z', ticket_id: '#10482', service_name: 'kiki-ai', model_name: 'claude-sonnet', contains_raw_pii: false, input_data_classification: 'PSEUDONYMISED' },
    { timestamp: '2026-03-13T08:51:00Z', ticket_id: '#10481', service_name: 'kiki-ai', model_name: 'claude-sonnet', contains_raw_pii: false, input_data_classification: 'PSEUDONYMISED' },
    { timestamp: '2026-03-12T17:22:00Z', ticket_id: '#10479', service_name: 'kiki-ai', model_name: 'claude-sonnet', contains_raw_pii: true,  input_data_classification: 'PERSONAL' },
  ],
  data_erasure_log: [
    { timestamp: '2026-03-10T10:00:00Z', data_subject_id: 'DSB-8821-a4f2', requested_by: 'dsr_portal', status: 'COMPLETED', systems_erased: ['freshdesk', 'vault', 'analytics'] },
    { timestamp: '2026-03-07T15:44:00Z', data_subject_id: 'DSB-7612-b9e1', requested_by: 'dsr_portal', status: 'COMPLETED', systems_erased: ['freshdesk', 'vault'] },
  ],
  security_event_log: [
    { timestamp: '2026-03-11T03:17:00Z', event_type: 'UNUSUAL_ACCESS_PATTERN', severity: 'MEDIUM', description: 'High-frequency vault reads from ip 10.0.4.22', detected_by: 'monitoring_system', breach_flag: false },
    { timestamp: '2026-03-08T21:05:00Z', event_type: 'FAILED_AUTH_BURST',      severity: 'HIGH',   description: '14 failed login attempts for dpo_admin in 60s',  detected_by: 'waf',               breach_flag: false },
    { timestamp: '2026-03-06T09:30:00Z', event_type: 'BREACH_REPORTED',        severity: 'CRITICAL', description: 'Inadvertent PII in outbound webhook payload',   detected_by: 'agent_sara',        breach_flag: true  },
  ],
  system_access_logs: [
    { timestamp: '2026-03-13T09:00:00Z', actor_id: 'ai_agent',   actor_type: 'SERVICE', action: 'READ_VAULT',    resource_type: 'vault_entry',    success: true },
    { timestamp: '2026-03-13T08:55:00Z', actor_id: 'agent_sara', actor_type: 'HUMAN',   action: 'APPROVE_DRAFT', resource_type: 'ticket_draft',   success: true },
    { timestamp: '2026-03-12T22:11:00Z', actor_id: 'unknown',    actor_type: 'UNKNOWN', action: 'READ_VAULT',    resource_type: 'vault_entry',    success: false },
  ],
  data_access_export_log: [
    { timestamp: '2026-03-10T10:03:00Z', data_subject_id: 'DSB-8821-a4f2', delivery_method: 'secure_link', status: 'DELIVERED', export_checksum: 'sha256:a1b2c3d4' },
    { timestamp: '2026-03-07T09:00:00Z', data_subject_id: 'DSB-6204-c7d3', delivery_method: 'email',       status: 'DELIVERED', export_checksum: 'sha256:e5f6a7b8' },
  ],
}

export const gdprProcessingActivities = [
  { activity_name: 'AI Ticket Processing',       legal_basis: 'Legitimate interest',    data_categories: ['Contact data', 'Message content'], retention_period: '180 days', cross_border_transfer: true  },
  { activity_name: 'PII Vault Storage',          legal_basis: 'Contractual necessity',  data_categories: ['PII tokens', 'Vault mappings'],    retention_period: '365 days', cross_border_transfer: false },
  { activity_name: 'Spam Detection',             legal_basis: 'Legitimate interest',    data_categories: ['Email headers', 'Sender domain'],  retention_period: '30 days',  cross_border_transfer: false },
  { activity_name: 'Translation Caching',        legal_basis: 'Legitimate interest',    data_categories: ['Anonymised text'],                  retention_period: '60 days',  cross_border_transfer: true  },
  { activity_name: 'Customer Support History',   legal_basis: 'Contractual necessity',  data_categories: ['Contact data', 'Support history'], retention_period: '365 days', cross_border_transfer: false },
]
