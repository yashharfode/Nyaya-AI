<div align="center">
  <img src="public/banner.jpg" alt="NyayaAI Banner" width="100%" />

  <br />

  # ⚖️ NyayaAI — From Legal Confusion to Legal Action

  **AI-Powered Legal Assistance Platform for Indian Citizens 🇮🇳**

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

  <br />

  [🌐 Live Demo (Coming Soon)](#) · [📖 Documentation](#features) · [🐛 Report Bug](https://github.com/yashharfode/Nyaya-AI/issues) · [✨ Request Feature](https://github.com/yashharfode/Nyaya-AI/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Multi-Language Support](#-multi-language-support)
- [Authentication](#-authentication)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🏛️ About the Project

**NyayaAI** is an AI-powered legal assistance platform designed to bridge the justice gap in India. Millions of Indian citizens face legal challenges daily but lack the knowledge, resources, or access to navigate the complex legal system. NyayaAI empowers them by providing:

- 🤖 **AI Legal Assistant** — Get instant, easy-to-understand answers to legal questions
- 📝 **Complaint Generator** — Auto-generate legally formatted complaints (FIR, consumer, RTI)
- 📋 **Evidence Checklist** — Know exactly what documents and proof to collect
- 🏛️ **Government Navigator** — Find the right authority, office, or helpline for your issue
- 🌐 **Multi-Language Support** — Access everything in Hindi, English, and 13+ regional languages

> *"Justice delayed is justice denied."* — NyayaAI ensures justice is never out of reach.

---

## ✨ Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 **Landing Page** | ✅ Complete | Beautiful, responsive homepage with hero section and feature highlights |
| 📖 **How It Works** | ✅ Complete | Step-by-step guide showing the platform workflow |
| 🔐 **Authentication** | ✅ Complete | Secure login/signup with bcrypt hashing & JWT sessions |
| 📊 **Dashboard** | ✅ Complete | Protected user dashboard with quick actions and case tracking |
| 🌍 **i18n (15+ Languages)** | ✅ Complete | Full multi-language infrastructure with Hindi & English translations |
| 🛡️ **Route Protection** | ✅ Complete | Middleware-based auth guards for private routes |
| 🤖 **AI Chat Assistant** | 🔜 Coming Soon | Conversational AI for legal guidance |
| 📝 **Complaint Generator** | 🔜 Coming Soon | Auto-generate FIR, RTI, and consumer complaints |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [SQLite](https://www.sqlite.org/) (via Prisma ORM) |
| **ORM** | [Prisma 7](https://www.prisma.io/) |
| **Auth** | Custom JWT ([jose](https://github.com/panva/jose)) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **i18n** | [next-intl](https://next-intl.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashharfode/Nyaya-AI.git
   cd Nyaya-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Configure environment variables**
   ```bash
   # .env file is auto-generated with SQLite defaults
   # Optionally add a custom JWT secret:
   echo 'JWT_SECRET=your_super_secret_key_here' >> .env
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in your browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
NyayaAI/
├── messages/                  # 🌍 Translation files
│   ├── en.json                #    English translations
│   └── hi.json                #    Hindi translations
├── prisma/
│   └── schema.prisma          # 🗄️ Database schema (User model)
├── public/                    # 📁 Static assets
├── src/
│   ├── actions/
│   │   └── auth.ts            # 🔐 Server Actions (login, signup, logout)
│   ├── app/
│   │   ├── [locale]/          # 🌐 Locale-aware routing
│   │   │   ├── page.tsx       #    Home page
│   │   │   ├── how-it-works/  #    How It Works page
│   │   │   ├── login/         #    Login page
│   │   │   ├── signup/        #    Signup page
│   │   │   └── dashboard/     #    Protected dashboard
│   │   └── globals.css        # 🎨 Global styles & CSS variables
│   ├── components/
│   │   ├── Navbar.tsx         #    Public navigation bar
│   │   └── DashboardNavbar.tsx #   Authenticated navigation bar
│   ├── i18n/
│   │   ├── routing.ts         #    i18n route configuration
│   │   └── request.ts         #    Message loader with fallbacks
│   ├── lib/
│   │   └── db.ts              #    Prisma client singleton
│   └── middleware.ts          # 🛡️ Auth + i18n middleware
├── .env                       # 🔑 Environment variables
├── prisma.config.ts           # ⚙️ Prisma configuration
└── package.json
```

---

## 🌍 Multi-Language Support

NyayaAI is built with **15+ Indian languages** infrastructure using `next-intl`:

| Language | Code | Status |
|----------|------|--------|
| 🇬🇧 English | `en` | ✅ Full translations |
| 🇮🇳 Hindi | `hi` | ✅ Full translations |
| 🇮🇳 Marathi | `mr` | 🔜 Fallback to English |
| 🇮🇳 Tamil | `ta` | 🔜 Fallback to English |
| 🇮🇳 Telugu | `te` | 🔜 Fallback to English |
| 🇮🇳 Kannada | `kn` | 🔜 Fallback to English |
| 🇮🇳 Bengali | `bn` | 🔜 Fallback to English |
| 🇮🇳 Gujarati | `gu` | 🔜 Fallback to English |
| 🇮🇳 Punjabi | `pa` | 🔜 Fallback to English |
| 🇮🇳 Malayalam | `ml` | 🔜 Fallback to English |
| 🇮🇳 Odia | `or` | 🔜 Fallback to English |
| 🇮🇳 Assamese | `as` | 🔜 Fallback to English |
| 🇮🇳 Urdu | `ur` | 🔜 Fallback to English (RTL) |
| 🇮🇳 Sanskrit | `sa` | 🔜 Fallback to English |
| 🇮🇳 Kashmiri | `ks` | 🔜 Fallback to English (RTL) |

> Language switching is built into the Navbar with automatic URL rewriting (e.g., `/en/dashboard` ↔ `/hi/dashboard`).

---

## 🔐 Authentication

NyayaAI uses a **fully local, zero-dependency authentication system**:

- **Password Hashing**: `bcrypt` with 10 salt rounds
- **Session Tokens**: JWT via `jose` (Edge-runtime compatible)
- **Cookie Storage**: HTTP-only, secure, SameSite cookies (7-day expiry)
- **Route Protection**: Next.js Middleware intercepts `/dashboard/*` routes
- **Database**: Local SQLite file — no external services required

```
Signup → bcrypt hash → SQLite → JWT → HTTP-only Cookie → Dashboard ✅
Login  → bcrypt compare → JWT → HTTP-only Cookie → Dashboard ✅
Logout → Clear Cookie → Redirect to Login 🔒
```

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Yash Harfode** — [@yashharfode](https://github.com/yashharfode)

Project Link: [https://github.com/yashharfode/Nyaya-AI](https://github.com/yashharfode/Nyaya-AI)

---

<div align="center">

  **Made with ❤️ for India 🇮🇳**

  *Empowering every citizen with legal knowledge and tools.*

  ⭐ **Star this repo if you believe in accessible justice for all!** ⭐

</div>
