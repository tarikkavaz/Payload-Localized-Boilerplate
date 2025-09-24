## Why

The current header navigation uses a basic Select dropdown for desktop and a simple mobile menu overlay. The Tailwind sample demonstrates a more modern, professional navigation pattern using HeadlessUI components with proper popover menus, better accessibility, and smoother animations. We need to modernize our header to match this pattern while using our existing UI components (Radix UI) and Lucide icons instead of HeadlessUI and Heroicons.

## What Changes

- Replace Select-based dropdown navigation with proper popover menus using Radix UI components
- Implement HeadlessUI-style navigation patterns adapted for our tech stack
- Add proper dark mode support with theme-aware styling
- Enhance mobile navigation with slide-out panel instead of simple overlay
- Add proper focus management and keyboard navigation
- Improve visual hierarchy and spacing to match modern design standards
- Replace any remaining basic dropdowns with sophisticated popover interfaces

## Impact

- Affected specs: `navigation-ui` (new capability)
- Affected code: 
  - `src/globals/Header/Nav/index.tsx` (complete rewrite)
  - `src/globals/Header/Component.client.tsx` (layout adjustments)
  - May need additional UI components if missing from existing set
- **BREAKING**: Navigation structure and styling will change significantly
- **BREAKING**: Mobile menu behavior will change from overlay to slide-out panel
