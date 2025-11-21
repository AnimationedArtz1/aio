# AIO V2.0 Admin Dashboard 🚀

**Production-Ready SaaS Panel** - AIO ekibi için sıfırdan yazılmış, Apple kalitesinde bir admin paneli. React 18, Vite, TypeScript, Tailwind CSS, Framer Motion ve Axios ile inşa edilmiştir.

## ✨ AIO V2.0 Yenilikleri

### 🎯 Kusursuz Mimari
- ✅ **Zero Config Setup** - Tek komutla çalışır duruma gelir
- ✅ **Clean Architecture** - Domain-driven dizin yapısı
- ✅ **Type-Safe** - %100 TypeScript kapsama
- ✅ **Mobile-First** - Tam responsive tasarım
- ✅ **Production-Ready** - Hatasız build, optimize bundle

### 🎨 DEEP SPACE PREMIUM Tasarım
- **Glassmorphism V2.0** - Buzlu cam efekti kartlar (`backdrop-blur-2xl`)
- **Zengin Renk Paleti** - Electric Blue (#3b82f6) + Neon Purple (#8b5cf6)
- **Gradient Vurgular** - Canlı buton ve navigasyon efektleri
- **Smooth Animations** - Framer Motion ile akıcı geçişler
- **Custom Scrollbars** - Tema ile uyumlu scroll barlar

### 🧠 Modül 1: Ajan Beyni (Agent Editor)
Tam teşekküllü AI yapılandırma modülü:
- **Ajan İsmi** - Kişiselleştirilmiş adlandırma
- **Rol Türü** - Satış / Destek / Genel (backend beklentisine uyumlu)
- **Model Seçimi** - Gemini Pro (akıllı) / Gemini Flash (hızlı)
- **System Prompt** - Kod editörü görünümlü, satır numaralı textarea
- **Temperature Slider** - Görsel slider (0.0 - 1.0)
- **Kaydet & Uygula** - Loading state + Success animation

### 💬 Modül 2: Canlı Chatbot Widget
- **Masaüstü**: Zarif popup (380x600px, sağ alt köşe)
- **Mobil**: Tam ekran deneyim (`fixed inset-0`)
- **LocalStorage** - Konuşma geçmişi kalıcılığı
- **Typing Indicator** - Üç nokta animasyonu
- **Error Handling** - Fallback mesajlar
- **Clear Chat** - Geçmiş temizleme

### 🏗️ Layout & Navigation
- **Mobil**: Hamburger menü → Sol kayar sidebar (Framer Motion)
- **Desktop**: Sabit sidebar (w-72, sticky)
- **Header**: Kullanıcı profili (MT - Mehmet Tutar / Admin), sistem durumu badge'i
- **Canlı Sistem Özeti**: Sidebar'da production API durumu

## 📂 Dizin Yapısı

```
src/
├── components/
│   ├── chat/
│   │   └── ChatWidget.tsx       # Mobilde tam ekran, LocalStorage persistent
│   ├── layout/
│   │   ├── Header.tsx           # Glassmorphism header, hamburger menü
│   │   └── Sidebar.tsx          # AnimatePresence mobil menü
│   └── ui/
│       └── Button.tsx           # Primary/Secondary variants + Loading state
├── hooks/
│   └── useMobile.ts             # Responsive breakpoint hook
├── layouts/
│   └── AppLayout.tsx            # Ana layout (Sidebar + Header + Outlet)
├── pages/
│   └── AgentEditor.tsx          # Kod editörü görünümlü AI konfigürasyonu
├── services/
│   └── api.ts                   # Axios client, slash temizleme, hata yönetimi
├── types/
│   └── index.ts                 # AgentConfig, ChatMessage, ChatResponse
├── utils/                        # (İleride eklenecek yardımcı fonksiyonlar)
├── App.tsx                       # React Router + Toaster
├── main.tsx                      # Entry point
└── index.css                     # Tailwind + DEEP SPACE utilities
```

## 🛠️ Kurulum & Çalıştırma

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Environment dosyasını oluştur
cp .env.example .env

# 3. Geliştirme sunucusunu başlat
npm run dev

# 4. Production build
npm run build

# 5. Build önizleme
npm run preview
```

## 🔐 Environment Variables

```env
VITE_N8N_WEBHOOK_URL=https://n8n.aio.web.tr
```

**Not**: Bu değişken zorunludur. Uygulama başlatılırken kontrol edilir.

## 🔗 API Entegrasyonu

| Endpoint | Metot | Payload | Açıklama |
| --- | --- | --- | --- |
| `/webhook/update-agent` | POST | `{ name, role_type, model, system_prompt, temperature }` | Ajan yapılandırmasını günceller |
| `/webhook/chat` | POST | `{ message: "..." }` | Chatbot mesajı gönderir, `{ reply }` döner |

### API Servisi Özellikleri
- ✅ Base URL'deki trailing slash'leri otomatik temizler
- ✅ Endpoint'leri dinamik ve doğru ekler
- ✅ Network hatalarında anlamlı mesajlar döner
- ✅ `react-hot-toast` ile kullanıcı bildirimleri
- ✅ 20 saniye timeout

## 🎨 Custom Tailwind Utilities

```css
.glass-card           → Glassmorphism kartlar
.glass-header         → Header için cam efekti
.gradient-primary     → Blue → Purple gradient
.hover-glow           → Hover'da scale + shadow
.btn-primary          → Gradient buton
.btn-secondary        → Glass buton
.input-field          → Cam efektli input
.select-field         → Cam efektli select
.textarea-field       → Kod editörü stil textarea
.skeleton             → Loading skeleton
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 1024px` - Sidebar gizli, hamburger menü aktif
- **Desktop**: `≥ 1024px` - Sidebar sabit, hamburger gizli
- **Chatbot Mobile**: Tam ekran (`inset-0`)
- **Chatbot Desktop**: 380x600px popup

## 🚀 Production Deployment

```bash
npm run build
# dist/ klasörü static hosting'e deploy edilebilir
```

### Deploy Ayarları
- **Base Path**: `/` (Vite config)
- **Router**: BrowserRouter (no hash)
- **Asset Optimization**: Automatic by Vite
- **Font Loading**: Inter fontu optimize edilmiş şekilde yüklenir

## 🎯 Kullanıcı Deneyimi

### Animasyonlar
- **Sidebar**: Slide-in-left with backdrop blur (Framer Motion)
- **Chatbot**: Scale + Opacity fade (Mobile: slide up)
- **Messages**: Opacity + Y-axis fade-in
- **Success State**: 3 saniye yeşil badge gösterimi

### Loading States
- **Save Button**: Spinner + "İşleniyor..." metni
- **Chat Messages**: 3 nokta bounce animasyonu
- **Disabled States**: Opacity 50%, cursor not-allowed

### Error Handling
- **API Errors**: Toast notification (kırmızı)
- **Network Errors**: Fallback mesajlar
- **Validation**: Inline feedback

## 🔧 Teknoloji Stack

| Kategori | Teknoloji |
| --- | --- |
| Framework | React 18 |
| Build Tool | Vite 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 11 |
| HTTP Client | Axios 1.7 |
| Routing | React Router DOM 7 |
| Notifications | React Hot Toast 2.6 |
| Icons | Lucide React |

## 👨‍💻 Geliştirici Notları

### Kod Standartları
- Functional components only
- TypeScript strict mode
- ESLint + TypeScript ESLint
- Path alias: `@/*` → `src/*`
- Interface > Type (object tipleri için)

### Naming Conventions
- Components: PascalCase (`AgentEditor.tsx`)
- Hooks: camelCase + `use` prefix (`useMobile.ts`)
- Utils/Services: camelCase (`api.ts`)
- CSS Classes: kebab-case (`glass-card`)

### Git Workflow
- Branch: `aio-v2-rewrite-zero-config-deep-space-agent-chatbot-api`
- Commit style: Conventional Commits

---

**AIO V2.0** - Production-ready, kusursuz bir SaaS paneli. Mehmet Tutar için, sevgiyle yazıldı. 💙
