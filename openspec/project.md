# Project Context

## Purpose
A modern, multilingual website template built with Payload CMS and Next.js featuring internationalization (i18n) support. This application serves as a demonstration and boilerplate for implementing localization in a Payload CMS website using the next-intl library.

## Tech Stack
- **Frontend**: Next.js 15.2.3 with React 19
- **CMS**: Payload CMS 3.55.1 with Lexical rich text editor
- **Database**: SQLite with @payloadcms/db-sqlite adapter
- **Styling**: Tailwind CSS with responsive design
- **UI Components**: Radix UI primitives with custom components
- **Internationalization**: next-intl for multi-language support
- **Email Service**: Resend for contact forms and notifications
- **Animation**: Framer Motion
- **Language**: TypeScript 5.7.3
- **Package Manager**: pnpm (preferred)
- **Testing**: Playwright for E2E testing
- **Deployment**: Docker support with docker-compose

## Project Conventions

### Code Style
- ESLint with Next.js configuration for linting
- Prettier for code formatting
- TypeScript strict mode enabled
- Tailwind CSS for styling with utility-first approach
- Component-based architecture with clear separation of concerns

### Architecture Patterns
- Next.js App Router with internationalized routing ([locale] segments)
- Payload CMS headless architecture with admin panel
- Block-based content system for flexible page layouts
- Global components (Header, Footer) with hooks for data fetching
- Utility functions organized by purpose in src/utilities/
- Custom hooks for reusable logic (useClickableCard, useDebounce)
- Payload plugins for extended functionality (SEO, Search, Form Builder, etc.)

### Testing Strategy
- Playwright for end-to-end testing
- Component testing with React Testing patterns
- Type safety through TypeScript compilation

### Documentation Strategy
- Use Context7 MCP for accessing up-to-date library documentation
- Use BrowserLoop MCP for console log error and warning checks
- Prefer external documentation sources over creating internal docs

### Git Workflow
- Simple direct-to-main workflow
- Changes are pushed directly as they are made
- No specific branching strategy or commit conventions
- Straightforward development process without formal code review requirements

## Domain Context
- **Content Management**: Website supports pages, posts, media, and users collections
- **Localization**: Currently supports English and Turkish with extensible i18n system
- **SEO**: Built-in SEO optimization with meta management and Open Graph support
- **Forms**: Contact forms with validation and email notifications
- **Search**: Built-in search functionality across content
- **Live Preview**: Real-time preview capabilities for content editing
- **Theming**: Dark/light theme support with context providers

## Important Constraints
- Node.js version: 18.20.2+ or 20.9.0+
- Database seeding is destructive (replaces all existing data)
- Requires environment variables for proper functionality (PAYLOAD_SECRET, etc.)
- Resend API key required for email functionality

## External Dependencies
- **Resend**: Email service for contact forms and notifications
- **Payload Cloud**: Optional cloud hosting service
- **SQLite**: Local database (can be replaced with other adapters)
- **Sharp**: Image processing and optimization
- **GraphQL**: API layer provided by Payload CMS
