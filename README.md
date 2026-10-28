# 🚀 DevShowcase

## A platform for developers to showcase their projects, share ideas, and connect with the developer community.

---

## 📝 Project Name

**DevShowcase** combines “Developer” and “Showcase”. The name reflects the main purpose of the application: providing developers with a space to present their projects, demonstrate their skills, and discover work created by others.

---

## 🌐 Live Demo

👉 [https://dev-showcase-sepia.vercel.app](https://dev-showcase-sepia.vercel.app)

---

## 📌 Features

- User registration and login
- OAuth authentication with supported providers
- Developer profiles with personal information
- Project creation and showcase
- Browse and discover projects shared by developers
- Search functionality for finding projects
- Comment functionality for project discussions
- Form validation for user input
- Responsive design for desktop and mobile
- Privacy Policy and Terms of Service pages
- User authentication and session management with Supabase

---

## 🧠 Project Plan

DevShowcase was developed as a platform where developers can showcase their work and explore projects from the developer community.

The application uses Next.js, React, and TypeScript to create a component-based user interface. Supabase provides authentication and database functionality, while reusable components help maintain a consistent design throughout the application.

The project focuses on combining project discovery, developer profiles, and user interaction in one application.

---

## 🛠 Tech Stack

- **Next.js** — React framework for application development
- **React** — Component-based user interface
- **TypeScript** — Type-safe JavaScript development
- **Tailwind CSS** — Responsive styling and UI design
- **Supabase** — Authentication and database services
- **TanStack Query** — Server-state management
- **React Hook Form** — Form state management
- **Zod** — Schema validation
- **React Icons** — Icons and visual elements
- **Vercel** — Application deployment

---

## 🧩 Project Structure

The application is organized around the Next.js App Router and a component-based architecture.

- **App Router** — Organizes application routes and pages
- **Components** — Contains reusable UI elements
- **Authentication** — Handles registration, login, and OAuth flows
- **Actions** — Organizes application actions
- **Providers** — Manages shared application providers
- **Supabase** — Supports authentication and database integration
- **Form Validation** — Uses React Hook Form and Zod
- **State Management** — Uses TanStack Query for server-state management

---

## ⚙️ Challenges & Solutions

### Authentication with Multiple Providers

Supporting email/password authentication alongside OAuth providers requires handling different authentication flows.

- **Solution:** Integrated Supabase Authentication to manage authentication and session handling.

### OAuth Provider Selection

Each OAuth button needs to initiate the correct provider flow.

- **Solution:** Pass the selected provider to the shared OAuth sign-in handler instead of hardcoding a single provider.

### Form Validation

Registration and login forms need to handle user input consistently.

- **Solution:** Use React Hook Form and Zod to manage form state and validate input.

### Data Management

The application needs a consistent way to manage data retrieved from external services.

- **Solution:** Use TanStack Query for server-state management and React components to present the data.

### Responsive Interface

The application should remain usable across different screen sizes.

- **Solution:** Use Tailwind CSS to build responsive layouts and reusable interface components.

---

## 📱 User Experience Improvements

- Clear navigation between application pages
- Consistent UI through reusable components
- Responsive layouts for desktop and mobile
- Form validation to help users correct input errors
- Authentication options for a smoother sign-in experience
- Dedicated Privacy Policy and Terms of Service pages
- Project-focused layout to support browsing and discovery

---

## 🚀 Future Improvements

- Enhanced project filtering and discovery
- More advanced search capabilities
- User profile customization
- Project likes and bookmarking
- Improved commenting and community interaction
- Additional developer profile information
- Expanded testing and accessibility improvements

---

## 👨‍💻 Author

### Arash Safari — Frontend Developer

**Technologies:** React, Next.js, TypeScript, JavaScript

- [GitHub](https://github.com/ArashSafarighouzhdi)
- [Portfolio](https://safariarash.dev)

---

<p align="center">
  Built with ❤️ using Next.js, React, and TypeScript.
</p>
