# Payload Localized Website

A modern, multilingual website built with Payload CMS and Next.js featuring internationalization (i18n) support. This application demonstrates how to implement localization in a Payload CMS website using the next-intl library.

## Tech Stack & Features

- **Framework**: Next.js with Payload CMS
- **Database**: SQLite with Payload's SQLite adapter
- **Email Service**: Resend for contact forms and notifications
- **Internationalization**: Multi-language support with next-intl
- **Styling**: Tailwind CSS with responsive design
- **UI Components**: Modern components built with Radix UI
- **Editor**: Rich text editing with Lexical
- **Search**: Built-in search functionality
- **SEO**: SEO optimization with meta management
- **Preview**: Live preview capabilities

## Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm (recommended) or npm

## Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific values. Key variables include:
   - `PAYLOAD_SECRET`: A secure secret key for Payload CMS
   - `NEXT_PUBLIC_SERVER_URL`: Your application URL (http://localhost:3000 for development)
   - `RESEND_API_KEY`: Your Resend API key for email functionality (optional)

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Database Seeding

To populate your database with sample content:

1. Navigate to the admin panel at http://localhost:3000/admin
2. Click the "Seed Database" button in the dashboard
3. This will create sample pages, posts, and a demo user

**Demo User Credentials:**
- Email: `demo-author@payloadcms.com`
- Password: `password`

> **Warning:** Seeding is destructive and will replace all existing data. Only use on fresh installations or when you can afford to lose current data.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm generate:types` - Generate Payload types

## Localization

This app supports multiple languages through next-intl. The seed script creates content in English and Turkish by default. To add more languages:

1. Add translations in the admin panel
2. Configure additional locales in the Payload config
3. Add corresponding message files in `src/i18n/messages/`

## Production Deployment

1. Build the application: `pnpm build`
2. Set production environment variables
3. Start the production server: `pnpm start`

## Docker Support

A Docker configuration is included for containerized deployment:

```bash
docker-compose up
```
