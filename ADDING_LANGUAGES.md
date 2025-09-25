# Adding New Languages to Payload Localized Boilerplate

This guide explains how to add new languages to the Payload CMS localized website. The project uses `next-intl` for internationalization and supports both frontend translations and Payload CMS admin localization.

## Overview

The localization system consists of several interconnected parts:
- **Payload CMS localization**: Backend content management in multiple languages
- **Frontend translations**: UI text and messages using next-intl
- **URL routing**: Localized URLs and pathnames
- **Collection mappings**: Translated collection slugs (e.g., "posts" → "yazılar" in Turkish)

## Step-by-Step Guide

### Step 1: Add Locale Configuration

**File to edit:** `src/i18n/localization.ts`

Add your new language to the `locales` array:

```typescript
const localization = {
  defaultLocale: 'en',
  locales: [
    {
      code: 'en',
      label: 'English',
    },
    {
      code: 'tr',
      label: 'Türkçe',
    },
    // Add your new language here
    {
      code: 'fr', // ISO language code
      label: 'Français', // Native language name
    },
  ],
}
```

**Important Notes:**
- Use standard ISO 639-1 language codes (e.g., 'fr', 'de', 'es')
- The `label` should be in the native language for better UX
- Follow the existing pattern: "English name - (Native name)" or just native name

### Step 2: Create Translation Messages

**File to create:** `src/i18n/messages/[locale].json`

Create a new JSON file for your language (e.g., `fr.json` for French):

```json
{
  "date-published": "Date de publication",
  "author": "Auteur",
  "page-not-found": "Cette page n'a pas pu être trouvée.",
  "go-home": "Accueil",
  "loading": "Chargement, veuillez patienter...",
  "posts": "Articles",
  "post": "Article",
  "related-posts": "Articles connexes",
  "showing": "Affichage",
  "of": "de",
  "range": "Affichage de {start}–{end} sur {total} {kind, select, post {{total, plural, one {article} other {articles}}} other {{total, plural, one {résultat} other {résultats}}}}",
  "no-results": "Aucun résultat trouvé.",
  "search": "Rechercher",
  "dashboard": "Tableau de bord",
  "previous": "Précédent",
  "next": "Suivant",
  "more-pages": "Plus de pages",
  "theme": "Thème",
  "auto": "Auto",
  "light": "Clair",
  "dark": "Sombre"
}
```

**Translation Tips:**
- Copy the structure from `src/i18n/messages/en.json`
- Pay attention to plural forms and ICU message format syntax
- Test complex messages like "range" carefully
- Consider cultural context, not just literal translation

### Step 3: Add Collection Mappings (Optional)

**File to edit:** `src/i18n/collections.ts`

If you want localized URLs for collections (like "posts" → "articles" in French), update the mappings:

```typescript
export const collectionMappings = {
  // English to Turkish mappings
  tr: {
    'posts': 'yazilar',
    'category': 'kategori',
    'categories': 'kategoriler'
  },
  // Add French mappings
  fr: {
    'posts': 'articles',
    'category': 'categorie',
    'categories': 'categories'
  },
  // Turkish to English mappings
  en: {
    'yazilar': 'posts',
    'kategori': 'category',
    'kategoriler': 'categories'
  },
  // French to English mappings (add these too)
  'articles': 'posts',
  'categorie': 'category',
  'categories': 'categories'
}
```

**Also update the `validCollections` array:**

```typescript
export const validCollections = [
  'posts',
  'yazilar',
  'articles', // Add French
  'category',
  'kategori',
  'categorie', // Add French
  'categories',
  'kategoriler',
  'categories' // French uses same word
]
```

### Step 4: Update Routing Configuration

**File to edit:** `src/i18n/routing.ts`

The routing will automatically pick up your new locale from the localization config, but if you added collection mappings, you need to update the `generatePathnames` function:

```typescript
const generatePathnames = () => {
  const pathnames: Record<string, any> = {
    '/': '/'
  }

  // Add collection index routes for all locales
  Object.entries(collectionMappings.tr).forEach(([en, tr]) => {
    const fr = collectionMappings.fr[en]; // Get the French equivalent
    pathnames[`/${en}`] = {
      tr: `/${tr}`,
      fr: `/${fr}`, // Add French
      en: `/${en}`
    }
  })

  // Add collection item routes for all locales
  Object.entries(collectionMappings.tr).forEach(([en, tr]) => {
    if (en === 'posts') {
      const fr = collectionMappings.fr[en]; // Get the French equivalent
      
      // Regular item routes
      pathnames[`/${en}/[slug]`] = {
        tr: `/${tr}/[slug]`,
        fr: `/${fr}/[slug]`, // Add French
        en: `/${en}/[slug]`
      }
      
      // Category routes
      pathnames[`/${en}/categories`] = {
        tr: `/${tr}/kategoriler`,
        fr: `/${fr}/categories`, // Add French
        en: `/${en}/categories`
      }
      
      pathnames[`/${en}/category/[slug]`] = {
        tr: `/${tr}/kategori/[slug]`,
        fr: `/${fr}/categorie/[slug]`, // Add French
        en: `/${en}/category/[slug]`
      }
    }
  })

  return pathnames
}
```

### Step 5: Install Required Dependencies

**Important**: Before adding new languages, ensure you have the required database dependencies installed:

```bash
pnpm add libsql @libsql/client
```

These packages are required by the `@payloadcms/db-sqlite` adapter. If you encounter a "Cannot find module 'libsql'" error, run the above command and restart your development server.

### Step 6: Add RTL Support (If Needed)

**File to edit:** `src/app/(frontend)/[locale]/layout.tsx`

For right-to-left languages (Arabic, Hebrew, etc.), update the direction logic:

```typescript
export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params
  const currentLocale = localization.locales.find((loc) => loc.code === locale)
  
  // Add RTL support for specific languages
  const rtlLanguages = ['ar', 'he', 'fa'] // Arabic, Hebrew, Persian
  const direction = rtlLanguages.includes(locale) ? 'rtl' : 'ltr'

  // ... rest of the component
  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={locale}
      dir={direction} // This will now be 'rtl' for RTL languages
      suppressHydrationWarning
    >
      {/* ... */}
    </html>
  )
}
```

### Step 7: Update Seed Data (Optional)

**Files to edit:** `src/endpoints/seed/index.ts` and related seed files

If you want to add seed data for your new language, you'll need to update the seed scripts. This is optional but helpful for testing.

**Key files that contain hardcoded locales:**
- `src/endpoints/seed/index.ts` - Main seed file with hardcoded 'en' and 'tr' references
- `src/endpoints/seed/home.ts` - Home page content with locale-specific content
- `src/endpoints/seed/contact-form.ts` - Form translations
- `src/endpoints/seed/contact-page.ts` - Contact page content

**Example update in `src/endpoints/seed/index.ts`:**
```typescript
// Add your new locale to the seed data creation
const locales = ['en', 'tr', 'fr'] // Add your new locale

// Then update all the hardcoded locale references throughout the file
// For example:
const homePage = await payload.create({
  collection: 'pages',
  locale: 'en',
  data: JSON.parse(
    JSON.stringify(home('en'))
      .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
  ),
  req,
})

// Add similar blocks for your new locale
const homePageFr = await payload.update({
  collection: 'pages',
  id: homePage.id,
  locale: 'fr',
  data: JSON.parse(
    JSON.stringify(home('fr')) // You'll need to create this
      .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
  ),
  req,
})
```

### Step 8: Update Payload CMS Content

After adding the language configuration:

1. **Restart your development server:**
   ```bash
   pnpm dev
   ```

2. **Access the admin panel:** http://localhost:3000/admin

3. **Create content in the new language:**
   - Go to any collection (Pages, Posts, etc.)
   - You'll see language tabs at the top of the editor
   - Add content for your new language
   - Make sure to publish the content

4. **Update global content:**
   - Go to Globals → Header/Footer
   - Add translations for navigation items and footer content

### Step 9: Test Your Implementation

1. **Check URL routing:**
   - Visit `http://localhost:3000/fr` (replace 'fr' with your language code)
   - Verify localized URLs work (if you added collection mappings)

2. **Test language switching:**
   - Use the locale switcher component to change languages
   - Verify all UI text is translated

3. **Verify content loading:**
   - Check that localized content displays correctly
   - Test fallback behavior for missing translations

## File Summary

Here are all the files you need to modify when adding a new language:

### Required Files:
1. `src/i18n/localization.ts` - Add locale configuration
2. `src/i18n/messages/[locale].json` - Create translation file

### Optional Files (if using localized URLs):
3. `src/i18n/collections.ts` - Add collection mappings
4. `src/i18n/routing.ts` - Update pathname generation

### Conditional Files:
5. `src/app/(frontend)/[locale]/layout.tsx` - Add RTL support if needed
6. `src/endpoints/seed/index.ts` and related seed files - Add seed data for new language



## Best Practices

### Translation Quality
- Use professional translators for production content
- Consider cultural context, not just literal translation
- Test plural forms and date formatting
- Validate ICU message format syntax

### Performance
- Translation files are loaded on-demand
- Keep message files reasonably sized
- Consider splitting large translation files if needed

### SEO Considerations
- Each language gets its own URL structure
- Implement hreflang tags if needed
- Consider locale-specific sitemaps

### Testing
- Test with both short and long translations
- Verify layout doesn't break with longer text
- Test all interactive elements in the new language
- Check mobile responsiveness with new content

## Troubleshooting

### Common Issues:

1. **Language not showing up:**
   - Restart development server after config changes
   - Check browser console for errors
   - Verify locale code matches in all files
   - Ensure required dependencies are installed: `pnpm add libsql @libsql/client`

2. **Translations not loading:**
   - Check JSON syntax in message files
   - Verify file naming matches locale code
   - Clear browser cache

3. **Language switching not working:**
   - ✅ **Fixed**: LocaleSwitcher now uses dynamic logic (no hardcoded checks)
   - Check browser console for LocaleSwitcher errors
   - Verify collection mappings are properly configured

4. **Localized URLs not working:**
   - Verify collection mappings are complete
   - Check middleware configuration
   - Test URL patterns manually

5. **Static generation fails:**
   - ✅ **Fixed**: Static generation now uses dynamic locale arrays
   - Check that localization config is properly imported

6. **"Cannot find module 'libsql'" error:**
   - Install missing dependencies: `pnpm add libsql @libsql/client`
   - Clear Next.js cache: `rm -rf .next`
   - Restart development server

7. **Layout breaking:**
   - Test with longer translations
   - Check RTL layout if applicable
   - Verify responsive design

### Getting Help

- Check the next-intl documentation: https://next-intl-docs.vercel.app/
- Payload CMS localization docs: https://payloadcms.com/docs/configuration/localization
- Review existing implementations in `tr` (Turkish) for reference

## Example: Adding Spanish (es)

Here's a complete example of adding Spanish:

1. **Update `src/i18n/localization.ts`:**
```typescript
{
  code: 'es',
  label: 'Español',
},
```

2. **Create `src/i18n/messages/es.json`:**
```json
{
  "date-published": "Fecha de publicación",
  "author": "Autor",
  "posts": "Artículos",
  // ... rest of translations
}
```

3. **Update `src/i18n/collections.ts` (optional):**
```typescript
es: {
  'posts': 'articulos',
  'category': 'categoria',
  'categories': 'categorias'
},
```

4. **Restart server and test:** `pnpm dev`

That's it! Your Spanish localization should now be working.
