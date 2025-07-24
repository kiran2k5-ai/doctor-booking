# MyDoctor - Medical Appointment App

A modern medical appointment booking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Help and Support Page** with FAQ accordion and Contact information
- **Responsive Design** - Mobile-first approach
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Interactive UI** with smooth animations

## Project Structure

```
mydoctor/
├── src/
│   └── app/
│       ├── help-support/
│       │   └── page.tsx          # Help & Support page
│       ├── layout.tsx
│       └── page.tsx
├── data/
│   └── faq.json                  # FAQ data
└── ...
```

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kiran2k5-ai/doctor-booking.git
   cd doctor-booking
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint for code linting

## Pages

### Help and Support (`/help-support`)
- **FAQ Tab**: Interactive accordion with frequently asked questions
- **Contact Tab**: Contact information with phone number
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## Technologies Used

- **Next.js 15.4.3** - React framework with App Router
- **TypeScript** - For type safety
- **Tailwind CSS** - For styling
- **React Hooks** - For state management

## Development

To modify the FAQ content, edit the `data/faq.json` file:

```json
[
  {
    "id": 1,
    "question": "Your question here",
    "answer": "Your answer here"
  }
]
```

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
