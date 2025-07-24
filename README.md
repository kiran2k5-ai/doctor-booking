# MyDoctor - Help & Support Center

A clean, responsive Help & Support page for a medical appointment application.

## 🎯 Overview

This repository contains a focused Help & Support center built with modern web technologies. The application provides users with essential support information through an interactive FAQ system and direct contact options.

## ✨ Features

- **📋 Interactive FAQ Section** - Accordion-style questions with smooth animations
- **📞 Contact Information** - Direct phone support access
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **⚡ Fast Performance** - Built with Next.js 15 and optimized for speed
- **🔒 Type Safety** - Full TypeScript implementation
- **♿ Accessibility** - ARIA labels and semantic HTML

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kiran2k5-ai/doctor-booking.git

# Navigate to project directory
cd doctor-booking

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000/help-support](http://localhost:3000/help-support) to view the Help & Support page.

## 🛠️ Technology Stack

- **Next.js 15.4.3** - React framework with App Router
- **React 19** - Latest React features and hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS v4** - Utility-first CSS framework
- **Modern tooling** - ESLint, PostCSS, and more

## 📁 Project Structure

```
src/
├── app/
│   ├── help-support/
│   │   └── page.tsx        # Main Help & Support page
│   ├── layout.tsx          # Root application layout
│   ├── page.tsx           # Home page (redirects to help-support)
│   └── globals.css        # Global styles and Tailwind imports
└── data/
    └── faq.json           # FAQ questions and answers data
```

## 🎨 Key Components

### FAQ Accordion
- Interactive expand/collapse functionality
- Smooth animations with rotating icons
- Multiple items can be open simultaneously
- Responsive design for all screen sizes

### Contact Section
- Clean contact card design
- Direct phone number display
- Professional medical application styling

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile** (default): Optimized touch interactions
- **Tablet** (sm:): Enhanced spacing and typography
- **Desktop** (md:, lg:, xl:): Full-featured layout

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of an internship development program.

---

**Repository:** https://github.com/kiran2k5-ai/doctor-booking  
**Live Demo:** Navigate to `/help-support` after starting the development server
