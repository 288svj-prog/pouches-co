# Pouches.co Design System

**Version 1.3** — Living document, last updated April 28, 2026.

This document is the source of truth for visual design, component behavior, and interaction specifications across pouches.co. It is intended to be read alongside the reference image library (see Appendix B) and handed to Claude Code as the implementation brief.

When in conflict, this document supersedes the reference images. Images show the *intent*; this document specifies the *parameters*.

---

## Table of Contents

1. [Brand Foundation](#1-brand-foundation)
2. [Design Tokens](#2-design-tokens)
3. [Typography System](#3-typography-system)
4. [Layout & Grid](#4-layout--grid)
5. [Components](#5-components)
6. [Interactions & Behavior](#6-interactions--behavior)
7. [Page Templates](#7-page-templates)
8. [Mobile-Specific Patterns](#8-mobile-specific-patterns)
9. [Photography & Imagery](#9-photography--imagery)
10. [Voice & Copy Guidelines](#10-voice--copy-guidelines)
11. [Appendix A — Implementation Notes](#appendix-a--implementation-notes)
12. [Appendix B — Reference Image Library](#appendix-b--reference-image-library)

---

## 1. Brand Foundation

### 1.1 Brand Position

Pouches.co is the only multi-brand nicotine pouch destination shipping every Swedish brand worldwide. Where Nicokick, Northerner, and Snusdirect compete on warehouse-grade utility (price, breadth, fast shipping), Pouches.co competes on brand sensibility, curation, and editorial sophistication.

The brand sits in a category that currently has zero brand-led entrants. The closest reference points are not direct competitors but adjacent premium DTC brands: Aimé Leon Dore (lookbook polish), Liquid Death (attitude in a regulated category), Aesop (editorial restraint), Linear.app (UI craft), and Nothing.tech (single-accent monochromatic systems).

### 1.2 Voice

- Confident, not loud
- Direct, not aggressive  
- Editorial, not stuffy
- Specific, not generic
- Concise — every word earns its place

### 1.3 Visual Personality

The system runs on **deep black** with a **single high-impact acid-green accent**. Photography is **lookbook flash style** on textured surfaces (concrete, denim, leather, brushed metal). Typography pairs a **bold italic display sans** for editorial moments with a **clean medium-weight body sans** and a **monospace** for technical metadata. The visual language is designed to be defensible: a competitor can copy a black-background-with-neon site in a weekend, but cannot copy a brand whose moat is craft and editorial sensibility.

---

## 2. Design Tokens

### 2.1 Color

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0A0A0A` | Page background, dominant surface |
| `--color-bg-secondary` | `#151515` | Cards, modal/drawer backgrounds, input fields |
| `--color-bg-tertiary` | `#1F1F1F` | Hairline dividers, subtle borders |
| `--color-border-default` | `#2A2A2A` | Card borders, input borders |
| `--color-border-muted` | `#1F1F1F` | Section dividers |
| `--color-text-primary` | `#FFFFFF` | Body copy, headlines, primary content |
| `--color-text-secondary` | `#B3B3B3` (light gray) | Brand names on cards, supporting metadata |
| `--color-text-muted` | `#666666` | Disabled states, very subtle metadata |
| `--color-accent-primary` | `#CCFF00` | THE acid green. Wordmark, CTAs, active states, eyebrow tags, accents |
| `--color-accent-on` | `#0A0A0A` | Black text used on top of acid-green surfaces |

**Accent rules:**
- Acid green is used sparingly. As a guideline, no more than ~10% of any given screen should be acid green. It signals action, brand, or active state — never decoration.
- Never put acid-green text on white. Acid green only appears on `--color-bg-primary` or `--color-bg-secondary`.
- Black text (`--color-accent-on`) is the only acceptable text color on acid-green surfaces.

### 2.2 Spacing Scale

8-point base scale.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight inline gaps, chip internal padding |
| `--space-2` | 8px | Default small gap |
| `--space-3` | 12px | Card internal padding (mobile) |
| `--space-4` | 16px | Default content padding, mobile side margins |
| `--space-5` | 24px | Card internal padding (desktop), drawer padding |
| `--space-6` | 32px | Section internal spacing |
| `--space-7` | 48px | Section vertical breathing room |
| `--space-8` | 64px | Major section breaks |
| `--space-9` | 96px | Hero / feature section padding |
| `--space-10` | 128px | Top-of-page hero padding (desktop) |

### 2.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-pill` | 9999px (full) | Buttons, chips, pill badges |
| `--radius-card` | 8px | Product cards, content cards |
| `--radius-modal` | 16px | Drawer top corners, modal containers |
| `--radius-input` | 8px | Form inputs |

### 2.4 Elevation / Glow

We don't use traditional drop shadows. Instead:

- **Hover glow:** outer acid-green halo at 2px spread, 20% opacity. Used on product card hover state.
- **Modal/drawer:** no shadow on the surface itself; the dim overlay (50% black) on the page beneath is what creates separation.

### 2.5 Border Treatment

Two border styles only:

- **Hairline default:** 1px solid `--color-border-default` — used on card edges, input edges
- **Hairline divider:** 1px solid `--color-border-muted` — used between filter sections, between FAQ rows, between footer link groups

Never use thick borders (>1px) anywhere except the active variant chip on a hovered product card and the acid-green hairline divider that appears above sticky filter bars.

### 2.6 Motion / Animation

Motion is restrained. Premium brands move slowly and decisively. We don't bounce, we don't elastic, and we don't celebrate micro-interactions with confetti.

#### Duration tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 100ms | Hover state on small elements (buttons, links), heart icon toggle |
| `--duration-fast` | 150ms | Modal fade-in, simple state changes |
| `--duration-base` | 200ms | Card hover photo crossfade, dismiss animations |
| `--duration-slow` | 250ms | Drawer slide-up, accordion expand/collapse |
| `--duration-xslow` | 400ms | Cart badge pulse on add-to-bag |

#### Easing tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default for entering elements (drawers opening, menus appearing) |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Default for exiting elements (drawers closing, modals dismissing) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Two-way state changes, tabs |
| `--ease-linear` | `linear` | Loading skeletons (shimmer), progress indicators |

#### Motion rules

- **Reduced motion:** all animations respect `prefers-reduced-motion: reduce`. Replace transforms with cross-fades, replace slides with fade-ins, drop pulse animations entirely.
- **No simultaneous large motions:** if the drawer is sliding up, the page underneath stays still. We don't animate two large elements at once.
- **No bouncing:** spring-style overshoot is not in the brand. Animations land on the target value, no oscillation.
- **Hover only on input:hover-capable devices:** wrap hover states in `@media (hover: hover)` so touchscreens don't trigger them on tap-and-release.

---

## 3. Typography System

### 3.1 Type Stack

```css
--font-display: 'Editorial New Italic', 'Tiempos Headline Italic', serif;
/* Heavy bold italic display — used for H1, H2, hero headlines */
/* Working substitute: any custom italic display sans, eg "Migra Italic", "Druk Wide Italic" */

--font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
/* Medium-weight clean sans — body, UI labels, product names */

--font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
/* Technical metadata — eyebrow tags, badges, stat strips */
```

**Note on the wordmark:** The "POUCHES" wordmark itself uses a heavily customized italic display sans. This is hand-tuned and should be treated as a fixed asset (SVG), not regenerated from a font. See Appendix A.

### 3.2 Type Scale

| Style | Family | Size | Weight | Line-height | Usage |
|-------|--------|------|--------|-------------|-------|
| Display XL | display italic | 160-200px | bold | 0.95 | Wordmark hero, brand-name takeovers |
| Display L | display italic | 80-96px | bold | 1.0 | Section H2 (BYO, Reviews, Email) |
| Display M | display italic | 56-64px | bold | 1.0 | PLP H1, page titles |
| Display S | display italic | 32-44px | bold | 1.05 | Subsection titles |
| Heading L | body sans | 22px | bold | 1.3 | Card titles, modal titles |
| Heading M | body sans | 18px | bold | 1.4 | Product name on cards |
| Heading S | body sans | 16px | bold | 1.4 | Filter section headers (when not using mono) |
| Body L | body sans | 18px | medium | 1.5 | Hero subheads, key body copy |
| Body M | body sans | 15-16px | medium | 1.5 | Default body copy |
| Body S | body sans | 13-14px | medium | 1.5 | Card metadata, secondary copy |
| Caption | body sans | 12px | medium | 1.4 | Star rating counts, very small text |
| Mono Eyebrow | mono | 11-12px | regular | 1.0 | Eyebrow tags above headlines |
| Mono Badge | mono | 9-11px | regular | 1.0 | Pill badges, technical metadata, breadcrumbs |

### 3.3 Type Treatment Rules

- **Italic display** is reserved for emotionally significant moments — page titles, section headlines, wordmark. It is *not* used for body copy or UI labels.
- **All-caps with letter-spacing** is reserved for technical contexts: navigation items, eyebrow tags, badges, breadcrumbs, stat strips. Letter-spacing approximately +0.05em.
- **Sentence case** for all body copy, product names, button labels (with the exception of CTA buttons which are all-caps).
- **Mono is metadata-only.** Never use mono for body copy or headlines.

### 3.4 Specific Patterns

**Eyebrow tag pattern** (used at the top of nearly every section):
- Mono, all-caps, 11-12px, acid-green, with `·` separators between segments
- Example: `12 BRANDS · ONE CHECKOUT`
- Always sits directly above an italic display headline

**Stat strip pattern** (used in provenance, brand pages, footers):
- Mono, all-caps, 11-12px, white text with acid-green `·` dot dividers
- Example: `EST. 1822  ·  SWEDISH HERITAGE  ·  47 COUNTRIES`

**Breadcrumb pattern**:
- Mono, all-caps, 10-11px, light gray with acid-green `·` separators
- Example: `HOME · BRANDS · ZYN`

---

## 4. Layout & Grid

### 4.1 Breakpoints

| Name | Width | Notes |
|------|-------|-------|
| `--bp-mobile` | < 768px | Single-column layouts, bottom-sheet patterns, sticky bottom nav |
| `--bp-tablet` | 768-1023px | Hybrid — collapses some desktop multi-column to 2-up |
| `--bp-desktop` | 1024-1439px | Full desktop layouts, sidebar PLPs, multi-column footer |
| `--bp-wide` | ≥ 1440px | Default desktop design target — most renders are at 1440 |

### 4.2 Container Widths

- **Mobile:** 100% width minus 16px side margins
- **Tablet:** 100% width minus 32px side margins  
- **Desktop:** Max-width 1280px, centered, with 80px side margins minimum
- **Wide:** Max-width 1440px, centered, content can extend full-bleed for hero sections

### 4.3 Common Grid Patterns

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Product grid | 2 columns | 3 columns | 3 columns (with sidebar) or 4 columns (no sidebar) |
| Brand wall | 2 columns | 3 columns | 4 columns × 3 rows |
| Footer link sections | Accordion (single column) | 2 columns | 4 columns |
| BYO Box section | Stacked (photo first) | Stacked | 50/50 split (photo right) |
| Provenance section | Stacked (photo first) | Stacked | Photo full-bleed with copy overlay |

### 4.4 Section Vertical Rhythm

- **Major section padding:** 96px top + 96px bottom on desktop, 64px on mobile
- **Sub-section padding:** 48px on desktop, 32px on mobile
- **Within-section element gaps:** follow spacing scale, defaulting to `--space-5` (24px) between paragraphs

---

## 5. Components

### 5.1 Button

Three variants. All use `--radius-pill`.

#### Primary (Acid)
- Fill: `--color-accent-primary`
- Text: `--color-accent-on` (black), bold, all-caps, body sans
- Height: 56px on desktop CTAs, 48px in modals/drawers, 40px for in-card actions
- Padding: 24px horizontal minimum
- Hover: brightness +5%
- Active: scale 0.98, brightness -3%
- Disabled: 30% opacity

#### Secondary (Outline)
- Fill: transparent
- Border: 1px solid `--color-text-primary` (white)
- Text: white, bold, all-caps
- Same heights and padding as Primary
- Hover: background `rgba(255,255,255,0.05)`

#### Tertiary (Text link)
- No fill, no border
- Text: `--color-accent-primary` (acid green), underlined, body sans
- Often paired with `→` or `←` arrow
- Used for "Read more", "Show all 12 →", "Clear all"

#### Quick-Add (PLP-specific)
- **Desktop:** small acid-green pill, `+ ADD`, mono uppercase 11px, height 32px
- **Mobile:** acid-green circle 40×40px containing a black `+` glyph centered
- On hover state: replaced with full-width acid-green pill `ADD TO BAG · $X.XX`

### 5.2 Input

#### Text Input (Email, Search, Form)
- Background: `--color-bg-secondary` (#151515)
- Border: 1px solid `--color-border-default` (#2A2A2A)
- Border radius: `--radius-input` (8px)
- Height: 56px (default), 48px (compact)
- Text color: white
- Placeholder color: light gray (#666)
- Padding: 16px horizontal, 16-20px on left
- Focus state: border becomes `--color-accent-primary`, no glow
- **Stack pattern on mobile** (email capture): input on top, full-width button below with 8px gap

#### Checkbox (Filter)
- Square, 20×20px
- Unchecked: hairline white border, transparent fill
- Checked: solid acid-green fill, black checkmark inside
- Always paired with sentence-case label in body sans 14px
- Often followed by gray product count `(24)` in 13px

#### Radio Button (Sort)
- Circular, 20×20px
- Unchecked: hairline white border, transparent fill
- Selected: thin acid-green outer ring, acid-green inner dot
- Always paired with sentence-case label in body sans 16px
- Optional right-side mono uppercase descriptor in 11px light gray

#### Range Slider (Price)
- Track: 2px tall, dark `--color-border-default`
- Active range: 2px tall, `--color-accent-primary`
- Handles: 16×16px circles, acid-green fill, thin black inner ring
- Range readout below: mono uppercase `RANGE: $4 — $9`

#### Form Validation States

All form inputs (text inputs, email, search, address, payment fields) follow these state rules:

**Default state** — see Text Input above.

**Focus state**
- Border: `--color-accent-primary` (acid-green)
- No outer glow, no ring
- Caret color: acid-green
- Label (if floating label pattern): shrinks to 11px and shifts to `--color-accent-primary`

**Filled / valid state** (after blur with valid content)
- Border: `--color-border-default` (back to default)
- Optional subtle acid-green check icon at right edge (only on critical fields like email)

**Error state**
- Border: `#FF4444` (red — the only place red appears in the system)
- Helper text below field: `#FF4444`, 12px, body sans, with leading `Info` icon
- Error message format: specific and actionable. Good: "Email needs an @ — try again." Bad: "Invalid input."
- Field shakes 4px left/right twice over 200ms when validation fires (only on submit attempts, not on blur — too aggressive)

**Disabled state**
- Background: `#0A0A0A` (slightly darker than default)
- Border: `#1F1F1F` (muted)
- Text: `--color-text-muted` (#666)
- Cursor: `not-allowed`

**Helper text (default)**
- Below field, 12px body sans, `--color-text-secondary` (light gray)
- Used for hints like "We'll never share your email." or "21+ verification required at checkout."
- Always above any error message — they're stacked, not replaced

**Required indicator**
- Asterisk `*` in `--color-accent-primary` immediately after label, no space
- Don't use the word "required" — the asterisk is enough

**Inline validation timing**
- Email: validate on blur (after user finishes typing)
- Strong validation (CC numbers, addresses): validate on blur, plus before submit
- Don't validate on every keystroke — feels aggressive and shows errors before user finishes typing

### 5.3 Card

#### Product Card

```
┌─────────────────────────┐
│ [BESTSELLER]      [♡]   │  ← TL: pill badge (optional), TR: heart button
│                          │
│      [Product Photo]     │  ← square, lookbook flash on textured surface
│                          │
│                          │
├─────────────────────────┤
│ ZYN                      │  ← brand name, gray uppercase 11px
│ Cool Mint                │  ← product name, white bold 14-16px
│ [6mg · STRONG]           │  ← strength chip
│                          │
│ $4.99           [+ ADD]  │  ← price + quick-add button
│ ★★★★★ (248)              │  ← stars + review count, 11px
└─────────────────────────┘
```

**Dimensions:**
- Desktop (3-up): ~320px wide, photo 320×320 square
- Desktop (4-up): ~280px wide
- Mobile (2-up): viewport_width / 2 - 24px

**States:**
- Default: `--color-bg-secondary` background, hairline `--color-border-default` border
- Hover (desktop): outer acid-green glow, photo swaps to alternative angle, variant chips appear, +ADD becomes full-width ADD TO BAG
- Tap quick-add (mobile): opens Quick-Add Modal (see 5.6)

#### Brand Card (Brand Wall)

Same skeleton as product card but:
- Photo shows ONE flagship product from the brand
- Top-left: tiny mono `12 PRODUCTS` count (varies per brand)
- Bottom: brand name in white sans bold uppercase 16px (left) + small acid-green `→` arrow (right)
- No price, no stars, no quick-add button

#### Review Card

```
┌──────────────────────────────────────┐
│ ★★★★★              [VERIFIED ✓]      │  ← stars + verified pill
│                                       │
│ "Got my box in Toronto in 4 days."    │  ← headline, white bold italic 18-20px
│                                       │
│ Coming from Canada that's witchcraft. │  ← body, white medium 13-14px, 3 lines
│ Tracking was real, packaging tight.   │
│                                       │
│ Marcus K.  🇨🇦 CANADA      MAR 2026   │  ← author + flag + country / date
└──────────────────────────────────────┘
```

### 5.4 Chip / Pill

Three categories with four total visual treatments. All use `--radius-pill`.

#### Filter Chip (active filter, removable)
- Hairline acid-green border, transparent fill
- Text: white sans uppercase, 11-12px, with format `LABEL: VALUE`
- Trailing `×` close icon, also acid-green
- Example: `STRENGTH: STRONG ×`

#### Badge Chip (read-only)
- Variant 1: filled acid-green, black text, mono uppercase 9-10px (e.g. `BESTSELLER`)
- Variant 2: dark fill with hairline border, white text, mono uppercase 10px (e.g. `6mg · STRONG`)

#### Selectable Chip (variant picker)
- Default: dark fill, hairline white border, white text, mono uppercase 10-12px
- Selected: hairline acid-green border, acid-green text
- Used in PDP variant pickers and the hover-state inline variant picker on PLP cards

### 5.5 Navigation

#### Top Sticky Nav (Desktop)

Layout: 3-zone, fixed to top, full width, 56-64px tall.

```
┌──────────────────────────────────────────────────────────────┐
│ [POUCHES wordmark]    SHOP / DROPS / BRANDS / ...    ACCOUNT │
└──────────────────────────────────────────────────────────────┘
   left zone            center zone (centered)        right zone
```

- Background: `--color-bg-primary`
- Border-bottom: hairline `--color-border-muted` (only when scrolled past hero)
- Wordmark: italic acid-green, ~24px tall, 16px tall on tablet
- Center menu: white sans uppercase 13px with `/` separators, generous letter-spacing
- Right zone: `ACCOUNT · SEARCH · BAG (n)`, white sans uppercase 13px
- Sticky on scroll, no animation

#### Top Compact Nav (Mobile)

Layout: 3-zone, fixed to top, 56px tall.

```
┌──────────────────────┐
│ ☰    POUCHES    [🛍0] │
└──────────────────────┘
```

- Left: hamburger icon, white, 24×24px tap target 44×44px
- Center: italic acid-green wordmark, 16px tall
- Right: shopping bag icon with acid-green count badge

#### Mobile Hamburger Menu (slide-in from left)

When the hamburger icon is tapped, a full-height drawer slides in from the left edge, occupying ~85% of viewport width. Background `--color-bg-primary`. The remaining 15% is the dimmed overlay (50% black) that dismisses the drawer when tapped.

**Drawer contents, top to bottom:**

1. **Header** (64px tall, hairline divider beneath)
   - Left: italic acid-green POUCHES wordmark, 18px tall
   - Right: X close icon

2. **Account block** (top section, 16px padding)
   - If signed out: outline pill button "SIGN IN" full-width + secondary text link "Create an account →"
   - If signed in: avatar circle + greeting "Hi, {firstname}" + "View account →" link

3. **Primary navigation** (large tap targets, 56px tall each row)
   - SHOP ALL → links to /shop
   - DROPS → links to /drops
   - BRANDS → expands inline accordion showing all 12 brand names as sub-links
   - FLAVORS → expands inline accordion showing all 8 flavor categories
   - STRENGTH → expands inline accordion showing 4 strength tiers
   - BUILD A BOX → links to /build (acid-green text — this is the differentiator, treat differently)
   - JOURNAL → links to /journal

4. **Secondary navigation** (smaller, gray text, 44px tall)
   - Help & Shipping
   - Track Order
   - Wholesale
   - Affiliate

5. **Footer block** (sticky at bottom of drawer)
   - Country/currency selector pill: "🇨🇦 Canada · USD ▾"
   - Acid-green age warning strip: "FOR ADULTS 21+ ONLY"

**Behavior:**
- Open animation: drawer slides in from left over `--duration-slow` (250ms) `--ease-out`
- Dismiss triggers: tap X, tap dimmed overlay, swipe drawer left past 30% threshold
- ESC key dismisses (for hardware keyboards / accessibility)
- When drawer is open, body scroll is locked (overflow: hidden on body)
- Active page indicator: current page's nav row has acid-green left border, 3px wide, full-height of the row

#### Sticky Bottom Nav (Mobile only)

Fixed to bottom of viewport. Always visible. 64px tall.

5 evenly-spaced icon+label tap targets:
1. SHOP (house icon)
2. BROWSE (magnifier icon)
3. BUILD (box/grid icon)
4. ACCOUNT (person icon)
5. CART (bag icon, with count badge)

- Background: `--color-bg-primary` 
- Top border: hairline acid-green divider
- Active state: icon and label both turn acid-green
- Tap target minimum 44×44px

#### Utility Bar

Sits above the nav. Full-width strip, ~32px tall.

- Background: `--color-accent-primary` (acid green)
- Text: black, mono uppercase 11px (10px mobile)
- Content pattern: `FREE WORLDWIDE SHIPPING OVER $49 · 21+ VERIFIED · USD ▾`
- Includes country/currency selector dropdown on the right

### 5.6 Drawers & Modals

#### Bottom-Sheet Drawer (Mobile, e.g. Filter)

- Slides up from bottom edge
- Occupies 85% of screen height (Filter), 50% (Sort), 60% (Quick-Add)
- Top corners: `--radius-modal` (16px radius)
- Background: `--color-bg-primary`
- Drag handle at top: 40×4px light gray pill, centered, 8px from top edge
- Header: 56-64px tall, sticky within drawer
- Content area: scrollable
- Footer: sticky within drawer, contains primary CTA full-width
- Page behind: dimmed with 50% black overlay

**Open animation:** slide up 250ms ease-out, overlay fades in concurrently  
**Dismiss animations:** slide down 200ms ease-in. Three triggers:
1. Drag handle / sheet pulled down past 40% threshold
2. Tap outside (on the dimmed overlay)
3. Tap the X close icon in the header

#### Center Modal (Desktop, used sparingly)

- Centered in viewport, max-width 480-640px depending on content
- Border radius: `--radius-modal`
- Background: `--color-bg-secondary`
- Border: 1px hairline `--color-border-default`
- Page behind: dimmed with 60% black overlay
- Open animation: fade-in 150ms + scale from 0.96 to 1.0
- Dismiss: fade-out 150ms. Triggers: ESC key, X icon, tap outside

### 5.7 Accordion

Used in: footer link sections (mobile), FAQ section, mobile filter sections.

- Each row is full-width, 56-64px tall
- Header: label on left, chevron icon on right (down ▾ when collapsed, up ▴ when expanded)
- Chevron color: acid-green
- Hairline divider below each row (1px `--color-border-muted`)
- Expanded content: smooth height transition, 250ms ease
- Indented from header by `--space-4` (16px)

### 5.8 Iconography

#### Library

Use **Lucide** (`lucide-react` for the React build) as the primary icon library. It's the closest match to the brand's restrained, geometric, hairline aesthetic. Icons are rendered as inline SVG, never as font icons.

#### Icon set (canonical)

| Function | Lucide name | Notes |
|----------|-------------|-------|
| Hamburger menu | `Menu` | Mobile nav left |
| Search | `Search` | Top nav right, search overlay |
| Account | `User` | Top nav right |
| Cart / Bag | `ShoppingBag` | Top nav right, bottom nav (mobile) |
| Heart (default) | `Heart` | Wishlist add, outlined |
| Heart (filled) | `Heart` with `fill="currentColor"` | Wishlist saved state |
| Plus | `Plus` | Quick-add button (mobile circle), quantity stepper |
| Minus | `Minus` | Quantity stepper |
| Close / dismiss | `X` | Modal/drawer close, filter chip remove |
| Chevron down | `ChevronDown` | Dropdowns, collapsed accordion, sort |
| Chevron up | `ChevronUp` | Expanded accordion |
| Chevron right | `ChevronRight` | "View all" navigation |
| Arrow right | `ArrowRight` | CTA buttons (`SHOP →`), text links |
| Arrow left | `ArrowLeft` | "Previous" pagination, "Remove filter" actions |
| Filter | `SlidersHorizontal` | Mobile filter button |
| Sort | `ArrowUpDown` | Mobile sort button |
| Globe | `Globe` | International shipping badge |
| Check | `Check` | Checkbox checked state, verified review badge |
| House | `Home` | Bottom nav SHOP |
| Browse / grid | `LayoutGrid` | Bottom nav BROWSE |
| Build / box | `Package` | Bottom nav BUILD |
| Star (filled) | `Star` with `fill="currentColor"` | Review ratings |
| Star (empty) | `Star` outlined | Half-rating displays |
| Info | `Info` | Tooltips, info hints |
| Truck | `Truck` | Shipping info |

#### Sizing

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-xs` | 12px | Inline within mono text, tiny indicators |
| `--icon-sm` | 16px | Default in-text icons, button arrows |
| `--icon-md` | 20px | Filter checkboxes, form inputs |
| `--icon-lg` | 24px | Nav icons, primary actions |
| `--icon-xl` | 32px | Empty states, feature icons |

#### Stroke weight

All Lucide icons render at **1.5px stroke** by default. We override to **2px stroke** for icons used at sizes ≥24px (nav icons, larger UI), keeping 1.5px for smaller inline uses. This matches the bolder feel of the typography at larger scales.

```jsx
<Heart size={24} strokeWidth={2} />
<ArrowRight size={16} strokeWidth={1.5} />
```

#### Color rules

- Icons inherit `currentColor` by default — they take their color from surrounding text
- Active/selected states: acid-green
- Default: white on dark backgrounds, gray for secondary positions
- Never colored fills (no rainbow icons, no brand-colored icons)
- Heart filled state: white (favorited indicator on photos), or acid-green if on a non-photo surface

#### Tap targets

Even when an icon is rendered at 16px, its tap target must be ≥44×44px on touch devices. Use invisible padding around the icon to expand the hit area. This is critical for the heart icon on product cards (icon is 16-20px but the button container is 44×44px).

### 5.9 Loading & Skeleton States

We use skeleton screens, never spinners. A premium site never shows a loading spinner — it shows the shape of the content that's about to appear, and that shape is filled with subtle shimmer. The user's eye anticipates where content will land.

#### Skeleton appearance

- Background fill: `--color-bg-secondary` (#151515)
- Shimmer overlay: animated linear gradient sweeping left-to-right, 1.5s loop, `--ease-linear`
  - Gradient stops: `transparent 0%`, `rgba(255,255,255,0.04) 50%`, `transparent 100%`
- Border: matches the eventual content's border (hairline `--color-border-default` for cards)
- Border radius: matches the eventual content (`--radius-card` for cards, `--radius-pill` for chips)

#### Skeleton patterns by content type

**Product card skeleton:**
- Square photo area: full skeleton fill
- Brand line: 40% width × 8px tall
- Product name line: 80% width × 14px tall
- Strength chip: 60px wide × 16px tall pill
- Price line: 30% width × 14px tall
- Star line: 60% width × 8px tall

**PLP grid loading:** show 6 product card skeletons in the same grid configuration (3-up desktop, 2-up mobile). Skeleton stays for at most 2 seconds — if data hasn't loaded by then, swap to error state.

**PDP loading:**
- Gallery area: square skeleton on left
- Right column: brand line, product name (large), price, variant chip rows, ADD TO BAG button placeholder
- Below-the-fold sections (reviews, related): lazy-load on scroll with skeletons

**Drawer/modal opening with data:** drawer animates in instantly with skeleton content inside, then content swaps in when ready. Don't hold the drawer open animation for the data fetch.

#### Empty data states (different from loading)

When data has loaded but there's nothing to show:
- Wishlist empty: "Nothing saved yet. Tap the heart on any product."
- Recent searches empty: don't show the "Recent searches" section at all
- Cart empty: large illustration of empty bag, "Your bag is empty." headline, "Browse all brands →" CTA

These use the empty-state pattern from PLP zero-results — be helpful, not apologetic, always offer a specific action.

#### Error states

When data load fails:
- Network error: "Couldn't reach the shelf. Check your connection and try again." with an outlined "Retry" button
- Out-of-stock product: keep the card visible but overlay 60% black + acid-green "BACK SOON" pill diagonally across the photo
- 500 errors: dedicated error page with the wordmark, "Something broke. We're on it." copy, and a "Back to shop →" link

#### Image loading

- All images use the LQIP (low-quality image placeholder) blur-up pattern
- Initial render: 16-32px tiny version blurred to 20px, scaled to fit, in `--color-bg-secondary`
- Crossfade to full-resolution image over `--duration-base` once loaded
- Never show a broken-image icon — always fall back to a styled placeholder (dark background with the brand's small wordmark watermarked at 10% opacity)

### 5.10 PDP-Specific Components

These components appear primarily (or exclusively) on the Product Detail Page.

#### Sticky Compact PDP Header

When the user scrolls past the main product gallery, a compact sticky bar appears below the main nav, persisting across the rest of the scroll. Provides instant access to the primary action without forcing scroll-up.

**Structure:**
- Height: 64px desktop, 56px mobile
- Background: `--color-bg-primary` (#0A0A0A)
- Bottom border: hairline `--color-border-muted`
- Layout: 2 zones, justified (left flex-start, right flex-end)
- Left zone: 40×40 product thumbnail (rounded `--radius-card`) + product name + variant in single line ("ZYN Cool Mint · 6mg")
- Right zone: price + `ADD TO BAG` button (smaller variant, ~40px height)

**Behavior:**
- Appears at scroll position where main gallery's bottom edge clears viewport top + main nav height
- Slide-down 200ms `--ease-out` on appear
- Slide-up 150ms `--ease-in` on disappear (when user scrolls back up to gallery)
- Mobile: replaces the full nav so the user has either main nav OR sticky compact PDP header, not both

#### Variant Chip with Thumbnail

A richer variant chip used for flavor selection on PDPs. Shows a tiny circular product image inside the chip alongside the label.

**Structure:**
- Height: 40px (44px tap area)
- Padding: 4px left, 16px right, 4px top/bottom
- Border-radius: `--radius-pill`
- Layout: 32px circular thumbnail on left + label text right
- Default: dark fill, hairline white border, white sans uppercase 11px label
- Selected: hairline acid-green border + acid-green label text + faint acid-green outer glow on the chip
- Click target: full chip is interactive, not just the label

**Used in:**
- PDP variant selectors (FLAVOR section)
- PLP card hover state inline variant picker
- Mobile horizontal-scroll variant carousels (1.5 chips visible per row, with peek pattern)

#### Star Distribution Chart

Horizontal bar chart showing review breakdown by star rating. Used in PDP reviews section.

**Structure:**
- 5 horizontal rows, one per star rating (5★ at top, 1★ at bottom)
- Each row: 32-40px tall, with 12px vertical gap between rows
- Row layout: `[star label] [bar track] [count]` — 3-column with fixed widths on outer columns
- Star label: 40px wide, "5 ★" pattern, white sans 13px + acid-green star icon
- Bar track: flex-grow, 8px tall, `--color-bg-tertiary` empty fill, rounded `--radius-pill`
- Bar fill: acid-green, animated from 0% on first render (1s `--ease-out`)
- Percentage label inside the fill (right-aligned within the filled portion)
- Count: 60px wide, mono uppercase 11px light gray, right-aligned

**Behavior:**
- Bars animate from 0% to actual value when the section scrolls into view (intersection observer)
- Clicking a row filters the review list below to only that rating

#### Spec Table

Two-column structured product data presentation. Used inside the Specifications accordion on PDP.

**Structure:**
- Single column on mobile (stacked label + value), two-column on desktop (label left ~30%, value right ~70%)
- Each row: hairline `--color-border-muted` divider on bottom, 14px vertical padding
- Label: mono uppercase 11px `--color-text-secondary` (light gray)
- Value: body sans 14px white
- For long values (e.g. ingredients list), the value wraps to multiple lines while the label stays at the top
- Country flag emoji is allowed inline in values (e.g. "🇸🇪 Sweden")

**Canonical fields for nicotine pouch products:**
- STRENGTH (e.g. "6mg per pouch · Strong")
- FORMAT (e.g. "Slim · Standard size")
- PIECES PER ROLL (e.g. "20 pouches")
- FLAVOR PROFILE (sensory description)
- DURATION (e.g. "~40 minutes per pouch")
- INGREDIENTS (full list)
- TOBACCO CONTENT (always "0% — Tobacco-free")
- MANUFACTURER (e.g. "Swedish Match · Helsingborg, Sweden")
- COUNTRY OF ORIGIN (with flag emoji)
- BEST BEFORE
- STORAGE

#### Bulk Pricing Display

Inline pricing affordance below the main price. Surfaces volume discounts without opening a separate dialog.

**Structure:**
- Inline single-line text in mono uppercase 11px acid-green
- Format: `BULK SAVE: 5 ROLLS — $22.45 · 10 ROLLS — $42.50 · 25 ROLLS — $99.95`
- Alternatively, on mobile: shorter `BULK SAVE: 5 ROLLS — $22.45` (truncated to fit, with "..." or "+ More" link)
- Clicking opens a small popover or expansion showing the full bulk pricing tier table

#### Helpful Counter (Reviews)

Thumb-up button + counter, used on individual review cards.

**Structure:**
- Pill-shaped tappable area, 32px tall
- Layout: small thumbs-up icon (Lucide `ThumbsUp`, 14px, 1.5 stroke) + label "Helpful (47)" in body sans 12px, 8px gap between icon and label
- Default: hairline `--color-border-default` border, transparent fill, white text
- Tapped/marked-helpful: acid-green border + acid-green icon + acid-green text + count increments and pulses for 400ms
- Once a user marks a review helpful, the action is "sticky" for that session — they can't unmark it

#### Image Gallery (Desktop)

Main image area + thumbnail strip beneath. Used in PDP left column.

**Structure:**
- Main image: square (1:1) aspect ratio, lookbook flash photography
- Below main image, horizontal row of 4 thumbnails (each 80×80, hairline border)
- Selected thumbnail: hairline acid-green border (vs default white)
- Below thumbnails: small mono uppercase 10px in light gray "1 / 4 — TAP TO ZOOM" indicator
- Click main image OR thumbnail: zooms to fullscreen (see Image Gallery — Fullscreen Zoom below)
- Click main image with cursor still on it (desktop): cursor changes to magnifier glass on hover, click triggers zoom

**Variants:** by default, products have 4 photos:
1. Top-down (default selected)
2. Side-angle / tin-on-edge
3. Opened tin showing pouches inside
4. Detail close-up of single pouch

#### Image Gallery — Fullscreen Zoom (Mobile)

Immersive fullscreen image viewer. Triggered by tap on gallery photo.

**Structure:**
- Background: solid black #000 (not the page bg)
- Top header overlay: 56px tall, semi-transparent black gradient (fades into the photo). Layout: X close icon (left, in circular dark backdrop) + position indicator center "2 / 4 — ZYN COOL MINT" mono uppercase + share icon (right)
- Main photo: full-bleed, 85% of vertical space, edge-to-edge no margins
- Pinch-to-zoom hint: small mono uppercase 9px label "PINCH TO ZOOM" with pinch gesture icon, bottom-right of photo, semi-transparent, fades out after 2s
- Bottom thumbnail strip: 80px tall, semi-transparent black gradient overlay, 4 thumbnails 64×64 with hairline borders, selected has acid-green border, dot indicators below

**Behavior:**
- Open: scale-up from gallery position to fullscreen, 250ms `--ease-out`
- Swipe left/right: navigate between photos, 200ms slide transition
- Pinch gesture: zoom in up to 3x with pan
- Double-tap: zoom in/out toggle (2x)
- Tap X / swipe down past 30% threshold: dismiss back to PDP
- Status bar visible (iOS), Safari URL bar dismissed (immersive mode)
- All other page chrome (top nav, sticky CTA, bottom nav) hidden

#### Sticky Bottom CTA Bar (Mobile PDP)

Fixed-to-bottom action bar that persists during the entire mobile PDP scroll. The conversion-critical detail.

**Structure:**
- Fixed to bottom of viewport, 80px tall
- Sits ABOVE the sticky bottom nav (so total bottom-anchored height is 144px)
- Background: `--color-bg-primary` with thin acid-green hairline divider on top
- 2-column split: 30/70
- LEFT 30%: stacked vertical alignment
  - Top: mono uppercase 10px gray "TOTAL"
  - Bottom: white sans bold 18px "$4.99"
- RIGHT 70%: full-height acid-green pill button "ADD TO BAG →" with bag icon, black bold uppercase 16px

**Behavior:**
- Always visible during PDP scroll
- Updates in real-time as user changes quantity (e.g. quantity 3 → "$14.97")
- Updates when variant changes (different price)
- On tap: triggers ADD TO BAG flow (bag count increments, mini cart drawer slides up)
- The 70% width on the button is intentional — it's the visual anchor of the screen

### 5.11 Cart Drawer

The cart drawer is the conversion linchpin — every ADD TO BAG triggers it, and it's the user's primary cart-management surface across the entire site (we don't have a dedicated `/cart` page; the drawer IS the cart).

#### Desktop variant — Slide-in from right

**Structure:**
- Width: 480px fixed
- Height: 100vh (full viewport height)
- Background: `--color-bg-primary` (#0A0A0A)
- Border-left: hairline `--color-border-muted` separating it from the dimmed page
- No rounded corners (extends edge-to-edge top/bottom of viewport)
- Page behind: dimmed with 50% black overlay

**Open animation:** slide left from off-screen-right, 250ms `--ease-out`, overlay fades in concurrently.  
**Dismiss animations:** slide right off-screen, 200ms `--ease-in`. Triggers:
1. X close icon in header
2. Tap on dimmed overlay (left of drawer)
3. ESC key
4. After successful checkout (auto-dismiss)

#### Mobile variant — Bottom-sheet

**Structure:**
- Height: 90% of viewport (leaves a small slice of dimmed page visible at top)
- Width: 100vw
- Background: `--color-bg-primary`
- Top corners: `--radius-modal` (16px radius)
- Drag handle at top: 40×4px light gray pill, 8px from top edge
- Page behind: dimmed with 50% black overlay

**Open animation:** slide up from bottom, 250ms `--ease-out`.  
**Dismiss animations:** slide down, 200ms `--ease-in`. Triggers:
1. X close icon in header
2. Drag handle pulled down past 40% threshold
3. Tap on dimmed area at top
4. After successful checkout (auto-dismiss)

#### Drawer Contents (both variants — content is the same, only container differs)

**Header** (sticky within drawer, 56-64px tall, hairline divider beneath):
- Left: `YOUR BAG` white sans uppercase bold 14-15px + count badge in acid-green pill `(3)` (or light gray `(0)` when empty)
- Right: X close icon, 24×24

**Free-Shipping Progress Strip** (shown only when cart has items, 36px tall, dark `--color-bg-secondary`):
- Centered text, mono uppercase 10-11px white: `ADD $14.01 MORE FOR FREE WORLDWIDE SHIPPING`
- Below the text: thin horizontal progress bar — `--color-border-default` track with `--color-accent-primary` fill at the achieved percentage
- When threshold is reached: text changes to `🎉 FREE WORLDWIDE SHIPPING UNLOCKED` and the bar shows fully filled in acid-green
- The threshold is configurable per region (currently $49 USD)

**Cart Items List** (scrollable, each item 96-100px tall on desktop, 80-88px tall on mobile):

Each item layout:
- Left: 80×80 (desktop) or 64×64 (mobile) product thumbnail with `--radius-card`, lookbook flash photography on the brand's home surface
- Middle: brand name (gray uppercase 11px) / product name (white bold 15-16px) / variant string (gray 12-13px, e.g. "6mg · Slim Format")
- Right zone: stacked, top-to-bottom: price (white bold 15-16px) → quantity stepper (− / count / + with 28×28 buttons) → "Remove" link with × icon (gray 11-12px)

Item state variants:
- **Just-added** (the item triggering this drawer open): 2px acid-green left border, persists for 3 seconds then fades to default state
- **BYO Box item** (part of a Build-Your-Own-Box selection): small acid-green pill badge `BYO` or `BYO BOX` top-left corner of thumbnail, original price shown struck-through, discounted price shown in acid-green directly beneath it, small acid-green caption "15% BYO discount" beneath
- **Out of stock** (rare, but possible mid-checkout): item dimmed to 60% opacity, "OUT OF STOCK" red caption replacing variant string, quantity stepper disabled, "Remove" link styled prominently

**BYO Upsell Card** (full-width within drawer, dark `--color-bg-secondary` with hairline border, 16px internal padding) — shown when cart has 1-5 items and includes the upsell hint:
- Small acid-green mono uppercase 10px header: `ADD {N} MORE TO COMPLETE YOUR BOX` (where N = 6 - current item count)
- White sans 13px subhead: `Mix any 6 — save 15% across the box`
- Outline pill button full-width: `ADD MORE PRODUCTS →` with hairline white border
- Hidden once cart hits 6+ items (BYO threshold is achieved)

**Order Summary** (above the footer CTA, 16px side padding, no border):
- Row 1: `Subtotal ({N} items)` gray 14px on left + price white bold 14px on right
- Row 2 (only if BYO discount applies): `BYO Discount` gray 14px + `−$X.XX` acid-green 14px
- Row 3 (only if other discount/promo): `Promo: {CODE}` gray 14px + `−$X.XX` acid-green 14px
- Row 4: `Shipping` gray 14px + `Calculated at checkout` gray 12px italic
- Hairline divider beneath
- Total row: `TOTAL` mono uppercase 12px gray on left + `$X.XX USD` white sans bold 22px on right

**Sticky Footer** (fixed at bottom of drawer, hairline divider above, 88-96px tall):
- Top row: small mono uppercase 10-11px white centered, with truck icon: `🚚 SHIPS FROM UPPSALA · 47 COUNTRIES`
- Below: full-width primary CTA pill `PROCEED TO CHECKOUT →` with small lock icon prefixed (signaling secure checkout)
- Below button: `Continue shopping` text link white sans 13px underlined, centered (smaller, tertiary)

#### Empty State (when cart has 0 items)

The empty state replaces the standard cart contents entirely — no progress bar, no items, no upsell, no summary, no PROCEED TO CHECKOUT button.

**Empty state contents (top to bottom):**

- **Header**: same `YOUR BAG (0)` pattern but with light gray (not acid-green) count badge — color signals the "empty" state subtly
- **Empty illustration**: ghosted outlined empty shopping bag in `--color-border-default` line illustration style, 72-80px tall, with subtle acid-green `0` badge in the corner. Drawn with thin strokes, premium, not cartoonish.
- **Italic display headline**: 26-32px, two stacked lines: `Your bag` / `is empty.`
- **Supportive subhead**: white 14-15px medium sans, 2 lines: `Nothing saved yet.` / `Start with our most-loved Swedish brands.`
- **Hairline divider**
- **Quick Start section**:
  - Eyebrow `QUICK START` acid-green mono uppercase 10px
  - H4 `Where most users begin.` white sans bold italic 16px
  - 3 stacked product card rows, each 64px tall with hairline border + `--radius-card`. Each row: 48-56px thumbnail + brand/name/strength·price + acid-green circular `+` button (40px diameter, black `+` glyph)
  - Default products: ZYN Cool Mint 6mg, VELO Polar Mint 4mg, ICEBERG Spearmint 8mg (the bestsellers)
  - Tapping `+` adds the item to cart and switches the drawer immediately to the with-items state
- **Or Explore section**:
  - Eyebrow `OR EXPLORE` acid-green mono uppercase 10px centered
  - 3 text links stacked vertically, centered, each 32px tall row:
    - `Browse all 102 products →`
    - `Build a Box (save 15%) →`
    - `Take the Flavor Finder quiz →`
- **Footer**: just a `Close` text link white sans 13px underlined, centered. No primary CTA — there's nothing to checkout. Empty states should not have phantom buttons.

#### Behavior Summary

- Drawer auto-opens on every successful ADD TO BAG event
- After auto-open: stays open until user dismisses or proceeds to checkout
- (NOTE: We do NOT auto-dismiss after a few seconds — this is different from a "toast" pattern. The drawer is the cart, and the user controls it.)
- Quantity stepper increments/decrements update price in real-time, including the BYO discount calculation if applicable
- Removing an item that brought the cart below the BYO threshold: discount is recalculated and the BYO discount line in summary disappears, the BYO pill badges on remaining items disappear
- Removing the last item: drawer transitions to empty state (no full close-and-reopen, smooth in-place transition)
- During checkout flow, the drawer dismisses and routes to `/checkout`

---

## 6. Interactions & Behavior

### 6.1 Filter System (PLP)

**Desktop behavior:**

- Filter sidebar is permanent, occupies left 25% of content area
- Each section is independently expandable with chevron toggle
- Default expanded: BRAND, STRENGTH, FLAVOR
- Default collapsed: FORMAT, PRICE, FEATURES
- "Show all 12 →" links expand truncated lists in-place
- Selected filters appear as chips above the product grid, with "Clear all" link
- Filters apply **on click** (no Apply button on desktop) — grid updates immediately
- URL updates with query string `?strength=strong&flavor=mint&brand=zyn` for shareable filter states

**Mobile behavior:**

- Sidebar replaced by sticky FILTER button in the filter/sort bar
- Tap FILTER opens the bottom-sheet drawer (see 5.6)
- Filter selections accumulate within the drawer but DON'T apply to the grid until "APPLY FILTERS · X RESULTS" button is tapped
- Apply button shows running result count that updates as filters change
- Drawer dismisses on Apply, X close, drag-down, or overlay tap
- Selected filter chips appear above the grid same as desktop, in horizontal-scroll row
- "Clear all" link clears everything and dismisses chips

**Empty state behavior:**

- When filters return zero results:
  - Page header changes eyebrow from `102 PRODUCTS · 12 BRANDS` to `0 RESULTS · 3 FILTERS APPLIED`
  - Grid is replaced with empty state block (see Mother PLP empty state, gen #32 / #42)
  - Empty state surfaces TWO actions:
    1. **Smart fallback:** "REMOVE 'BRAND: ZYN'" — system identifies the most-likely-removable filter (typically the most specific, e.g. brand or single-flavor)
    2. **Clear all** as secondary
  - Below the actions: "Closest matches" strip showing 3-5 products that match 2 of 3 filters
  - Below that: "Take the Flavor Finder quiz instead →" link

### 6.2 Sort

- Default sort: **Bestsellers** across all PLPs (research-tested winner)
- Brand PLPs default to Bestsellers EXCEPT brands with strength-defining identity (e.g. KILLA defaults to "Strength: High to Low")
- Strength PLPs default to "Strength: Low to High" (so the user starts at the gentlest option in their selected band)

**Mobile sort drawer** (see 5.6 Bottom-Sheet Drawer): smaller drawer, single-select radio, descriptive sublabels.

**Sort options (canonical list):**
1. Bestsellers (default)
2. Newest
3. Price: Low to High
4. Price: High to Low
5. Strength: Low to High
6. Strength: High to Low
7. Top Rated

### 6.3 Pagination vs. Infinite Scroll

**Decision: Pagination, not infinite scroll.**

Rationale: better SEO indexing, better back-button behavior, users feel "where they are." Infinite scroll is the easier engineering path but harms long-tail discovery and crawl efficiency.

**Pattern:**
- 24 products per page on desktop, 12 on mobile
- Mono uppercase pagination strip at bottom: `← PREVIOUS    1 (current)  2  3  4  5  ... 17    NEXT →`
- Current page in acid-green, others in white
- "..." indicates skipped pages
- Always show first, current ±2, and last

### 6.4 Product Card Interactions

**Desktop:**
- Hover anywhere on the card: enters hover state (see PLP Hover spec, gen #34)
  - Photo crossfades to alternative angle (200ms)
  - Inline variant chips appear if multiple flavors exist
  - "+ ADD" button transforms to full-width "ADD TO BAG · $X.XX" pill
  - Subtle acid-green outer glow on card border
  - "READY TO SHIP · UPPSALA" mono caption appears
- Click on photo, brand, or product name → navigate to PDP
- Click heart icon → toggle wishlist state, fill heart white
- Click variant chip → swap displayed variant (price, photo, name update)
- Click ADD TO BAG → product added to cart, mini cart preview slides in from right (see 6.5)

**Mobile:**
- Tap anywhere on card EXCEPT the "+" button → navigate to PDP
- Tap "+" button → opens Quick-Add Modal (see Quick-Add spec, gen #43)
- Tap heart icon → toggle wishlist
- Long-press (500ms): system context menu (Save, Share). Native iOS/Android behavior, don't override.

### 6.5 Cart Interactions

When ADD TO BAG is triggered (from PLP card, PDP, Quick-Add modal, or empty-state Quick Start):

1. Bag count badge in nav increments and pulses for 400ms (`--duration-xslow`, acid-green flash effect)
2. Cart Drawer opens — slide-in from right (desktop) or up from bottom (mobile). See §5.11 for full spec.
3. Drawer shows: free-shipping progress bar, all cart contents (with the just-added item highlighted with 2px acid-green left border for 3 seconds), BYO upsell card if applicable, order summary, PROCEED TO CHECKOUT primary CTA, "Continue shopping" tertiary
4. Drawer does NOT auto-dismiss — stays open until user explicitly closes or proceeds to checkout

When the user opens the cart drawer with no items in cart (e.g. clicking the bag icon in nav with empty cart):
- Drawer opens to the empty state pattern (see §5.11) — ghosted bag illustration, italic display headline, Quick Start section with 3 bestseller cards, Or Explore section with 3 alternative-path links, no PROCEED TO CHECKOUT button

When the user removes items via the cart drawer:
- Quantity stepper decrement to 0: item is removed (with brief slide-out animation, 200ms)
- Explicit "Remove" link click: same removal behavior, no confirmation dialog (premium pattern — trust the user, undo via re-add if needed)
- Removing all items: drawer transitions in-place to empty state (smooth, no full close-and-reopen)

### 6.6 Search

- SEARCH link in top nav opens a full-screen overlay (NOT a dropdown)
- Single text input at top, large, body sans 24-32px, placeholder "Search by brand, flavor, or strength"
- Below the input: 3 sections:
  - **Suggested searches:** mono uppercase chips (`MINT`, `STRONG`, `ZYN`, `BUILD A BOX`)
  - **Recent searches** (if user has history)
  - **Trending products** (3-up product cards)
- ESC key or X dismisses

(Search overlay not yet rendered — to be added.)

### 6.7 Build Your Own Box (BYO) Configurator

The flagship differentiator. Not yet rendered as a dedicated page in our library — placeholder spec:

- Path: `/build`
- User picks 6 products from the 102-product library
- Real-time price updates with 15% discount applied at 6+ items
- Drag-to-reorder or simple click-to-add
- Each selection visualized in a 2×3 grid (matches the BYO Box hero photography on the homepage)
- Sticky right-side or bottom summary: count, subtotal, discount, total, Checkout CTA

(BYO configurator to be specified and rendered as a separate phase.)

### 6.8 Brand PLP — Hero Band Interactions

The Brand PLP hero band (e.g. ZYN, KILLA pages) has two CTAs:

- **`SHOP {BRAND} →` (filled acid-green pill)** — scrolls smoothly to the product grid below the hero band, ~600ms scroll-margin-top accounting for sticky nav
- **`ABOUT {BRAND}` (outline pill)** — opens a centered modal (desktop) or full-screen takeover (mobile) with extended brand information:
  - Brand origin story (200-400 words)
  - Founder/parent company info
  - Manufacturing details (factory location, methods)
  - 3-5 archive lookbook photos in a small gallery
  - "View all {N} {BRAND} products →" link at the bottom that closes the modal

Modal/takeover dismiss: X close, ESC key, tap outside (desktop modal only).

(Brand "About" modal not yet rendered — to be added.)

### 6.9 Scroll Behavior

Unified scroll-state behavior across the site:

#### Top nav transformation on scroll

- **Initial state (scroll position 0):** transparent or matching the page's hero background. No bottom border. Wordmark at full size.
- **Scrolled state (after 100px scroll):** background becomes `--color-bg-primary` (#0A0A0A), 1px hairline `--color-border-muted` bottom border appears. Wordmark stays the same size.
- **Transition:** 200ms `--ease-out` on the background and border opacity changes
- **Hide-on-scroll-down behavior:** desktop nav stays sticky always. Mobile nav stays sticky always (so does the bottom nav). We don't auto-hide nav bars on scroll-down — user can always navigate.

#### Sticky elements priority

When multiple sticky elements stack vertically, the order from top is:

1. Utility bar (top-most, 32px)
2. Top nav (56-64px below utility bar)
3. Breadcrumb strip (PLP only, 32px below nav)
4. Sticky filter/sort bar (mobile PLP only, 48px below breadcrumb)

Total sticky height on a mobile PLP: ~168-176px. This is the reserved space at the top — main content scrolls beneath.

#### Anchor scrolling

When linking to in-page sections (e.g. footer "Our Story" → on-page section, or hero CTA "SHOP ZYN" → grid):

- Use `scroll-margin-top: 180px` on the anchor target so sticky nav doesn't cover the section header
- Smooth scroll behavior: `scroll-behavior: smooth` on `<html>`
- Respect `prefers-reduced-motion: reduce` — instant scroll for users who set that preference

#### Pagination scroll restoration

When a user clicks a pagination button, scroll to the top of the product grid (not the very top of the page). User wants to see "page 2" starting from where they were comparing products, not from the page header again.

- Set `scroll-margin-top: 200px` on the product grid container so it lands just below the sticky bars

#### Back-button scroll

When a user clicks a product card and goes to PDP, then hits browser back, restore them to the exact scroll position they were at on the PLP. Use `history.scrollRestoration = 'auto'` and verify the framework's router preserves it (Next.js does by default; verify on whatever stack we use).

---

## 7. Page Templates

### 7.1 Homepage

**Section flow (top to bottom):**

1. **Utility Bar** — acid-green strip, shipping/age/currency
2. **Sticky Nav** — wordmark + center menu + account/search/bag
3. **Hero** — solid black, wordmark hero with metadata tags, lookbook product strip below
4. **Build Your Own Box** — editorial split, flat-lay box photography, MIX ANY 6. SAVE 15%.
5. **Brand Wall** — 4×3 grid of 12 brand cards, "Every shelf from Sweden."
6. **Provenance / Made in Sweden** — full-bleed cinematic, Nordic still-life, three-line italic headline
7. **Flavor Finder Quiz Tease** — interactive preview card, "Don't know where to start?"
8. **Reviews** — Trustpilot strip + 3 review cards, "Don't take our word for it."
9. **Email Capture** — JOIN THE LIST. MISS NOTHING. 10% off first order
10. **Footer** — wordmark moment, 4-column links, payment icons, age warning

### 7.2 Mother PLP — `/shop`

**Section flow:**

1. Utility bar + sticky nav
2. Breadcrumb: `HOME · SHOP · ALL POUCHES`
3. Page header: eyebrow `102 PRODUCTS · 12 BRANDS` + italic H1 "All Nicotine Pouches." + intro paragraph
4. Active filter chip row (when filters applied)
5. Two-column body:
   - Left 25% sidebar: filter sections (BRAND, STRENGTH, FLAVOR, FORMAT, PRICE, FEATURES)
   - Right 75% grid: results count + sort dropdown + 3-column product grid + pagination
6. SEO outro: 2-column body copy + FAQ accordion + related categories strip
7. Footer

**Mobile transformations** (see Section 8):
- Sidebar replaced with sticky FILTER/SORT bar
- 3-column grid → 2-column grid
- Pagination strip → still pagination, just narrower buttons

### 7.3 Brand PLP — `/brands/{brand}`

Same skeleton as Mother PLP plus:

1. **Branded hero band** above filter chips:
   - Two-column on desktop, stacked on mobile
   - Left: eyebrow `BRAND · {N} PRODUCTS`, brand wordmark display (using their actual brand wordmark if available, otherwise large bold sans), brand origin paragraph (~50 words), stat strip (`EST. {YEAR} · {CITY} · {N} FLAVORS · {RATING} ★`), dual CTAs (filled `SHOP {BRAND} →` + outline `ABOUT {BRAND}`)
   - Right: lookbook hero photograph of 3+ tins from that brand on a textured surface
2. Acid-green hairline divider beneath the hero band
3. Active filter chip auto-includes `BRAND: {BRAND} ×`
4. Filter sidebar BRAND section has the brand pre-checked
5. **Cross-sell strip** below pagination:
   - Eyebrow `ALSO TRY` (or `FOR THE STRONG-ONLY` for KILLA-style brands)
   - Italic H3 `Brands {BRAND} fans love.` (or `If KILLA's your speed.`)
   - Horizontal row of 4 mini brand cards (photo + brand name + "View →")

### 7.4 Strength PLP — `/strength/{strong|regular|light|x-strong}`

Same skeleton as Mother PLP plus:

1. **Educational hero band:**
   - Eyebrow `STRENGTH · {RANGE}MG`
   - Italic H1 `{STRENGTH NAME}.` (e.g. "Strong.")
   - Body explaining what this strength range means
   - Visual strength scale (bar with marker showing where Strong sits relative to Light/Regular/X-Strong)
2. STRENGTH filter pre-checked in sidebar
3. **Mid-grid editorial card** (every ~6 products): "New to Strong? Here's the gateway pouch." with a featured product

(Strength PLP not yet rendered — to be added.)

### 7.5 Flavor PLP — `/flavors/{mint|fruit|...}`

Similar to Strength PLP but flavor-led. Hero photography reflects the flavor (fresh herbs for Mint, citrus peels for Citrus, etc.). Less educational, more sensory.

(Flavor PLP not yet rendered — to be added.)

### 7.6 PDP — `/products/{slug}`

The product detail page is the conversion-critical page in the system. Every PLP click ends here. Page structure:

**Section flow (top to bottom):**

1. **Utility bar + sticky nav** — same as all pages
2. **Breadcrumb** — `HOME · SHOP · {BRAND} · {PRODUCT NAME}` (mobile collapses brand if space-constrained)
3. **Main product hero** — desktop 50/50 split, mobile single-column:
   - **Gallery** (see §5.10 Image Gallery) — main image + 4 thumbnails (desktop) or full-bleed swipeable square + dot indicators (mobile)
   - **Product info panel:**
     - Eyebrow `{BRAND} · {STATUS}` (e.g. "ZYN · BESTSELLER", "ZYN · TRENDING", "ZYN · NEW")
     - H1 product name (40px desktop, 32px mobile, NOT italic — body sans bold)
     - Subhead `{STRENGTH} · {FORMAT}` (e.g. "6mg · Slim Format")
     - Star rating row + "Read reviews ↓" link
     - Price block: large `$X.XX` + mono uppercase "PER ROLL · 20 POUCHES" + bulk pricing display (see §5.10)
     - Key facts strip: 4 mono uppercase facts with acid-green dividers
     - **Variant selectors:**
       - FLAVOR — variant chips with thumbnails (see §5.10), 5-6 visible + "View all 10 →" link
       - STRENGTH — 2-4 chips horizontal
       - QUANTITY — stepper with BYO Box upsell hint
     - Description — italic body sans, 3-4 lines, sensory copy
     - **CTAs:**
       - Primary: full-width acid-green pill "ADD TO BAG · $X.XX" with bag icon
       - Secondary: outline pill "ADD TO BUILD A BOX →" (only shown if BYO progress is in flight)
     - Trust strip: 3 small items with icons "🚚 SHIPS FROM UPPSALA · ✓ 47 COUNTRIES · ↻ FREE RETURNS"
4. **Sticky compact PDP header** (appears on scroll, see §5.10)
5. **Accordion stack** — 4 collapsible sections, single-column max-width 960px:
   - Description (default expanded on first PDP visit)
   - Specifications (Spec Table component, see §5.10)
   - Shipping & Returns
   - Customer Reviews ({count})
6. **"Pairs Well With" cross-sell strip** — eyebrow `PAIRS WELL WITH` + italic H3 `Other {brand} flavors fans love.` + 4 product cards
7. **Reviews section** (anchor target for "Read reviews ↓"):
   - Eyebrow `{count} VERIFIED REVIEWS`
   - Italic H2 "What people are saying."
   - Aggregate stats (left) + Star Distribution Chart (right) (see §5.10)
   - Filter chips row + Sort dropdown
   - Review cards (see §5.3) with Helpful Counter (see §5.10)
   - Pagination
8. **About brand tease block** — eyebrow `BRAND · {N} PRODUCTS` + brand wordmark + brief origin paragraph + "Shop all {N} {BRAND} products →" link + lookbook hero photo of the brand
9. **Footer** — same as all pages

**Mobile transformations:**
- 50/50 hero split → single column, gallery on top
- Sticky bottom CTA bar appears (see §5.10) — replaces the in-info-panel ADD TO BAG button
- Sticky compact PDP header replaces main nav on deep scroll (not in addition to)
- Pairs Well With: 1.2 cards visible per row with horizontal scroll instead of 4-up grid
- Reviews aggregate + chart: stacked instead of side-by-side
- Spec table rows: stacked label-above-value instead of two-column

**Variant-switching behavior:**
- Tap a variant chip → URL updates via soft route change (no full page reload)
- Gallery photos refresh with brief acid-green border glow as feedback
- Product name + description + star count + price all swap to match new variant
- "CONTENT UPDATED" mono uppercase tag appears briefly in the top-right of info panel, fades after 2s
- ADD TO BAG button briefly pulses to confirm new state ready
- Breadcrumb updates to match new variant slug

### 7.7 Cart Drawer (no dedicated `/cart` page)

We do not have a dedicated cart page. The cart IS the drawer, summoned from any page. This is a deliberate choice — every additional page in the checkout flow is friction.

The Cart Drawer is fully specified as a component in §5.11. It functions as a "page" in the user's flow because:
- Every ADD TO BAG opens it
- Every bag-icon click in the nav opens it
- It contains all cart-management actions (quantity changes, removals, BYO upsell, summary)
- Routing to checkout starts from inside it

**Routes that trigger cart drawer auto-open:**
- Any `?openCart=true` query parameter (e.g. emails linking back to a saved cart can use this)
- Successful ADD TO BAG action from any source (PLP, PDP, Quick-Add modal, BYO Box configurator completion)

**Routes that do NOT auto-open the cart drawer:**
- Page navigation (going from PLP → PDP doesn't reopen cart)
- Refreshing the page
- Returning from checkout (cart should be empty after successful checkout — drawer auto-opens to empty state with a brief "Order placed →" success banner replacing the QUICK START section)

---

## 8. Mobile-Specific Patterns

### 8.1 Mobile-First Decisions Already Locked

- **Bottom-fixed sticky nav** in the thumb zone, 5 icons + labels, active state in acid-green. (Replaces traditional hamburger-only mobile nav.)
- **Single-column everything** — no 50/50 desktop splits forced into mobile. Photo on top, copy below.
- **Photo-first reveal** in feature sections (BYO, Provenance) — image hooks before copy converts.
- **Stacked email form** instead of side-by-side input + button. Both elements full-width tap targets.
- **Accordion footer** instead of multi-column grid.
- **Sticky full-width CTAs** above the bottom nav for conversion sections (BYO, Quiz, PDP).
- **Horizontal-scroll carousels** for product strips — peek the next tile to signal more.
- **Bottom-sheet drawers** for filter and sort, not sidebars.
- **2-column product grid** on mobile (bigger photos, more visual real estate per product).
- **Tap targets minimum 44×44px** universally.
- **Body type minimum 16px** to avoid iOS zoom on input focus.

### 8.2 Mobile Touch Patterns

| Gesture | Behavior |
|---------|----------|
| Tap card photo/title | Navigate to PDP |
| Tap "+" quick-add | Open Quick-Add modal |
| Tap heart icon | Toggle wishlist (no nav) |
| Tap variant chip | Update card variant |
| Long-press (500ms) | Native context menu (don't override) |
| Swipe left/right on carousel | Scroll horizontally |
| Pull down on drawer | Dismiss drawer (>40% threshold) |
| Tap dim overlay | Dismiss drawer/modal |
| Pinch zoom on PDP gallery | Zoom photo (PDP only, not PLP) |

### 8.3 Mobile Performance Constraints

- All hero photos must have a low-res placeholder (LQIP or blur-up) to render before image loads
- Above-the-fold content (nav + hero + first row of products) must be functional within 1.5s on 3G
- Bottom-sheet drawers should NOT block scroll on the main page if dismissed — use `pointer-events: none` on the dimmed overlay until drawer is fully open

---

## 9. Photography & Imagery

### 9.1 Hero Photography (Editorial / Story)

**Settings:** Nordic interiors, weathered wood, frosted windows, birch trees out of focus, cold morning light.  
**Composition:** Casually deliberate — products arranged like still-life painting, not catalog grid.  
**Lighting:** Soft directional from upper-right (window light) with hard shadows.  
**Palette:** Deep blacks, charcoal grays, weathered browns, cool gray-white. Acid-green branded card is the only chromatic accent.

**Used in:** Provenance section, Brand PLP heroes, BYO Box flat-lay.

### 9.2 Product Photography (PLP / PDP / Cards)

**Style:** Lookbook flash photography — single hard rim light, dramatic side shadow.  
**Surfaces:** Varied per card — cracked concrete, dark denim, black leather, brushed metal, slate, dark wood, fabric weaves.  
**Each brand should have a distinct "home surface"** that recurs in their hero shots:
- ZYN: cracked concrete (gateway, urban)
- VELO: dark denim (everyday, casual)
- ACE: black leather (premium)
- ICEBERG: slate (cold, sharp)
- FUMI: brushed metal (industrial)
- LOOP: dark wood (warmer)
- NORDIC SPIRIT: textured concrete (clean, Nordic)
- KILLA: brushed steel mesh (industrial, hard)
- SKRUF: dark fabric (heritage, soft)
- HELWIT: leather (refined)
- PABLO: rough concrete (raw)
- WHITE FOX: slate (cool)

**Composition rules:**
- Top-down for default card photo
- Side-angle / tin-on-edge for hover-state alternative photo
- Hard shadows, never flat lighting
- Tin should fill ~60% of the frame center
- Slight reflection if surface is metal or polished

### 9.3 BYO Box Photography

Single recurring composition: open matte black gift box, 6 tins arranged in 2×3 in dark molded foam, lid placed beside, 2-3 loose pouches scattered, branded matte black card with acid-green wordmark on it, on dark textured concrete. Top-down moody flash photography.

### 9.4 Brand Card / Brand Wall Photography

One flagship product per brand on its "home surface" (see 9.2). Lookbook style, hero-quality. Each card must be visually distinct from its neighbors.

### 9.5 Flavor Finder Quiz Photography

Each quiz option uses a small square photo:
- Mint flavors: fresh green herb leaves, frosted ice crystals, peppermint candy stick
- Fruit flavors: cut citrus, berries, stone fruit
- Cinnamon: cinnamon stick close-up
- Coffee: espresso pour, dark beans

Tightly cropped, color-saturated. Different visual register from the muted product photography — quiz photos are sensory and energetic.

### 9.6 What to Avoid

- White-background catalog product shots (this is what Nicokick/Northerner do — visually opposite of our brand)
- Stock photography (any) — every photo must feel commissioned
- Filtered / Instagram-style color grading (mustard tints, teal-orange, etc.)
- Lifestyle photos with people using the product (regulatory risk + breaks the editorial restraint)
- Overly bright lighting — we live in the dark register

### 9.7 Image Technical Specs

#### Aspect ratios by context

| Context | Aspect | Source resolution (min) | Notes |
|---------|--------|-------------------------|-------|
| Hero photograph (homepage, BYO) | 16:9 | 2560×1440 | Source at 2× of largest display size |
| Provenance / cinematic full-bleed | 16:9 | 2560×1440 | Subject anchored bottom-left for copy overlay |
| Product card photo | 1:1 | 1200×1200 | Default top-down angle |
| Product card photo (hover/alt) | 1:1 | 1200×1200 | Side-angle / tin-on-edge view |
| Brand card photo | 1:1 | 1200×1200 | Lookbook hero quality |
| Brand PLP hero band | 4:3 | 1920×1440 | 3+ tins arranged on textured surface |
| PDP gallery image | 1:1 | 2400×2400 | Higher source resolution for zoom |
| PDP gallery (lifestyle/context) | 4:5 | 1600×2000 | Optional vertical for editorial mix |
| Quiz option photo | 1:1 | 600×600 | Tightly cropped, color-saturated |
| Mobile hero (vertical-first) | 4:5 | 1600×2000 | Reflowed compositions for phone |

#### File formats & delivery

- **Primary format:** AVIF (best compression, modern browsers)
- **Fallback:** WebP (older browsers + iOS support)
- **Last fallback:** JPEG (legacy)
- Use `<picture>` element with `<source>` tags for format negotiation
- All images served via CDN (recommended: Cloudinary, imgix, or Vercel Image)

#### Responsive image sizing

Use `srcset` with the following width breakpoints:

```html
<img
  srcset="
    image-400.avif 400w,
    image-800.avif 800w,
    image-1200.avif 1200w,
    image-2400.avif 2400w
  "
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
  src="image-800.avif"
  alt="..."
/>
```

#### Compression targets

| Image type | Target file size | Quality |
|------------|------------------|---------|
| Hero / cinematic | < 200KB at 1920px wide | AVIF q=70, WebP q=80 |
| Product card | < 80KB at 800px wide | AVIF q=75, WebP q=85 |
| Thumbnail | < 30KB at 400px wide | AVIF q=70, WebP q=80 |
| LQIP placeholder | < 2KB | Heavy blur, 32px wide upscaled |

#### Art direction for responsive images

For hero and cinematic images, prepare separate desktop and mobile crops, not just resized versions:

- **Desktop (16:9 horizontal):** subject in left or right third, copy overlay opposite
- **Mobile (4:5 vertical):** subject reframed to portrait, often tighter on the product itself

Use `<picture>` with `<source media>` queries to swap the crop, not just the size:

```html
<picture>
  <source media="(max-width: 768px)" srcset="hero-mobile.avif" />
  <source srcset="hero-desktop.avif" />
  <img src="hero-desktop.jpg" alt="..." />
</picture>
```

#### Focal point handling

For product photos that may be cropped at different aspect ratios (e.g. card 1:1 vs PDP 4:5), define a focal point per image. Cloudinary supports `g_face`/`g_auto`/`g_north`; imgix supports `fp-x` and `fp-y` parameters. Default to the tin's center of mass. Re-crop dynamically rather than uploading multiple versions.

#### Alt text requirements

Every image must have descriptive alt text. Pattern: `[Brand] [product name] nicotine pouch tin on [surface]`.

- Good: `"ZYN Cool Mint nicotine pouch tin on cracked concrete with side shadow"`
- Bad: `"ZYN"` or `"Product image"`

For decorative images (background atmosphere, no product): use empty `alt=""` so screen readers skip them.

---

## 10. Voice & Copy Guidelines

### 10.1 Headline Patterns

**Italic display** (the "voice of the brand"):
- One declarative sentence, often with a period
- "All Nicotine Pouches."
- "Made in Sweden. Stocked in Sweden. Shipped from Sweden."
- "Mix any 6. Save 15%."
- "Don't take our word for it."
- "Every shelf from Sweden."

**Avoid:**
- Questions in display headlines (questions go in body or eyebrows)
- Multiple ideas in one headline
- Fluff modifiers ("amazing", "premium", "best")

### 10.2 Eyebrow Pattern

Mono uppercase, factual or labelling. Often `X · Y` format.

- `12 BRANDS · ONE CHECKOUT`
- `102 PRODUCTS · 12 BRANDS`
- `BRAND · 24 PRODUCTS`
- `FROM UPPSALA, WITH CARE`
- `TRUSTED · 8,400+ REVIEWS`
- `FIRST ORDER · 10% OFF`
- `FLAVOR FINDER · 60 SECONDS`

### 10.3 Body Copy Voice

Plain, specific, confident. Sentences are short. Numbers are concrete.

**Good:**
> Every Swedish brand we stock, in one searchable shelf. Filter by strength, flavor, or format. Shipped from Uppsala to 47 countries.

**Bad:**
> Welcome to your one-stop premium destination for the very best nicotine pouches from Sweden, conveniently shipped worldwide!

### 10.4 CTA Copy

Always all-caps, action-led. Often paired with `→` arrow.

- `BROWSE 12 BRANDS →`
- `BUILD YOUR BOX →`
- `EXPLORE BRANDS →`
- `TAKE THE QUIZ →`
- `SHOP ZYN →`

Avoid: "Click here", "Submit", "Get started", "Learn more" (too generic).

### 10.5 Microcopy / Trust Signals

Stat strips with `·` separators. Minimal, factual, never bragging.

- `EST. 1822 · SWEDISH HERITAGE`
- `47 COUNTRIES · WEEKLY SHIPMENTS`
- `0 INTERMEDIARIES · DIRECT FROM MAKER`
- `READY TO SHIP · UPPSALA`
- `21+ ONLY · UNSUBSCRIBE ANYTIME · NO SPAM`

### 10.6 Empty / Error States

Helpful, never apologetic. Always offer a specific action.

**Good (zero results):**
> Nothing matches that combination.  
> ZYN doesn't make an X-Strong Cinnamon pouch. Yet.  
> Try loosening one of your filters — or let us suggest something close.

**Bad:**
> Sorry! No products match your search. Please try again with different filters.

---

## Appendix A — Implementation Notes

### A.1 Wordmark Asset

The "POUCHES" wordmark is a fixed SVG asset. Do not regenerate from font. The wordmark is hand-tuned italic display — italics are aggressive, the ascender and descender lengths are custom, and the underline slash is part of the wordmark, not a separate element.

When rendering at scale (hero positions), the wordmark should fill approximately 75% of its container's width, with vertical centering and breathing room of at least 32px above and below.

When scaled down (nav, footer), the wordmark renders cleanly at 16-24px tall.

The wordmark is rendered in `--color-accent-primary` (acid green) on dark backgrounds. Black on light backgrounds is acceptable for print but does not appear on web (the entire web system runs dark).

### A.2 Browser Storage

For artifacts and prototypes built in Claude.ai's interface: do not use `localStorage` or `sessionStorage` (not supported in Claude artifacts). For production code on pouches.co itself, normal browser storage applies.

### A.3 Performance Targets

- Lighthouse Performance score ≥ 90 on mobile
- Largest Contentful Paint < 2.5s on 3G
- Cumulative Layout Shift < 0.1
- All product images served with WebP + AVIF fallbacks, lazy-loaded below the fold
- Hero images served at 2× DPI for retina, with appropriate `srcset`

### A.4 Accessibility

- Acid-green (#CCFF00) on pure black (#0A0A0A): contrast ratio ~18:1, passes WCAG AAA for all text sizes
- Acid-green on dark gray (#151515): contrast ratio ~16:1, also passes AAA but recheck per use
- All interactive elements have visible focus state (acid-green outer outline, 2px)
- All product photos have descriptive alt text (`"ZYN Cool Mint nicotine pouch tin on cracked concrete"` not just `"ZYN"`)
- Drawer/modal close behaviors: ESC key must dismiss, focus trap inside drawer when open, focus returns to trigger element on close
- Sticky bottom nav must be screen-reader announceable as a navigation landmark
- Skip-to-content link in nav for keyboard users

### A.5 SEO Requirements

- Each PLP must have unique H1 with category keyword
- Each PLP must have 200-400 word context block (the SEO outro section)
- Each PLP must have unique meta title and description
- FAQ accordions should use proper schema markup (`FAQPage` JSON-LD)
- Product schema (`Product` JSON-LD) on all PDPs and PLP cards
- Filter URL parameters should use canonical tags pointing to the parent category to avoid duplicate-content issues
- Pagination uses `rel="prev"` / `rel="next"` linking

### A.6 Tracking & Analytics

To be specified in a separate doc. Placeholder — at minimum: page views, add-to-bag events, checkout funnel events, filter usage, search queries, BYO Box completion rate, quiz completion rate.

### A.7 Internationalization (i18n)

Pouches.co ships to 47 countries. The site is single-language at launch (English) but designed to be translatable.

#### Currency

- Default: USD for all non-EU traffic
- EU traffic: EUR (auto-detected by IP, manually overridable via the utility-bar dropdown)
- UK traffic: GBP
- Currency switcher lives in the utility bar (top right) and footer (legal strip)
- Prices shown in customer's currency throughout — converted at checkout from base SEK pricing
- Rates refreshed daily, locked at checkout for 15 minutes

#### Country / shipping

- Country selector affects: shown shipping costs, available products (some brands have country-level restrictions), tax inclusion, currency
- Country detection on first visit via IP geolocation; user can override
- Country preference persists in cookie + customer account

#### Language (future-state preparation)

The site launches in English only, but build with i18n primitives in place so adding languages is a content task, not a re-architecture:

- All copy externalized to translation files (e.g. JSON keyed by namespace)
- No hard-coded strings in components
- Format dates, numbers, currencies via `Intl.DateTimeFormat`, `Intl.NumberFormat`
- Pluralization handled via ICU MessageFormat

Likely first additions post-launch: German, French, Swedish, Spanish.

#### Text expansion

All-caps UI elements (CTAs, eyebrows, badges) are particularly vulnerable to text expansion in translation. German averages +35% length over English, Russian +30%, French +20%. Mitigations:

- All-caps button labels: keep English source under 14 characters where possible
- Eyebrows: leave horizontal padding so a +35% expansion doesn't break the layout
- Stat strips: design so the row can wrap to two lines without breaking
- Display headlines: keep two-line max in English, allow three-line in translations
- Test with "pseudo-localization" (replace English with `[Pâßßéñgêr Ŵěīģhţ]` style) before any real translation

#### RTL (right-to-left)

We don't ship to MENA at launch (no Arabic markets in the 47-country list yet). When we do:

- Use logical CSS properties throughout (`margin-inline-start` not `margin-left`)
- Mirror layouts via `dir="rtl"` on the html element, not via custom RTL stylesheets
- Mirror directional icons (arrows, chevrons) but NOT brand-specific marks
- The wordmark stays LTR — italic POUCHES is the brand, not translated

---

## Appendix B — Reference Image Library

All reference images live at `C:\Users\288\.replicate-image-mcp\images\` and are numbered `000XXX.jpeg`.

### B.1 Homepage — Desktop

| Gen # | Section | Description |
|-------|---------|-------------|
| `000009` | Top of page | Sticky nav + wordmark hero with DROP 04 metadata + lookbook product strip |
| `000010` | BYO Box | "MIX ANY 6. SAVE 15%." 50/50 split with flat-lay photography |
| `000011` | Brand Wall | "Every shelf from Sweden." 4×3 grid of 12 brand cards |
| `000012` | Provenance | "Made in Sweden. Stocked in Sweden. Shipped from Sweden." Nordic still-life |
| `000013` | Flavor Finder Tease | "Don't know where to start?" 50/50 with live quiz preview |
| `000014` | Reviews | "Don't take our word for it." Trustpilot strip + 3 review cards |
| `000015` | Email Capture | "JOIN THE LIST. MISS NOTHING." 10% off CTA |
| `000016` | Footer | Wordmark moment + 4-column links + legal + age warning |

### B.2 Homepage — Mobile

| Gen # | Section | Description |
|-------|---------|-------------|
| `000020` | Top of page | Mobile nav, hero, lookbook strip, sticky bottom nav |
| `000021` | BYO Box | Photo-first single column, sticky BYO CTA |
| `000022` | Brand Wall | 2-column grid of brand cards |
| `000025` | Provenance | Stacked photo + copy + vertical stat strip |
| `000026` | Flavor Finder | Quiz card on top, copy below, sticky TAKE THE QUIZ CTA |
| `000027` | Reviews | Stacked review cards in iPhone bezel mockup |
| `000028` | Email Capture | Stacked email form, full-width Subscribe button |
| `000029` | Footer | Wordmark + accordion link sections + payment icons |

### B.3 Category Pages (PLP) — Desktop

| Gen # | Section | Description |
|-------|---------|-------------|
| `000030` | Mother PLP — first attempt | DISCARD. Superseded by 000031. |
| `000031` | Mother PLP — default | LOCKED. Foundation template. No active filters, Bestsellers sort, pagination, varied strength chips |
| `000032` | Mother PLP — empty state | LOCKED. 3 filters returning 0 results, smart fallback "REMOVE 'BRAND: ZYN'", closest-matches strip |
| `000033` | Hover state — full page attempt | DISCARD. Page chrome regressed, sidebar garbled. |
| `000034` | Hover state — close-up | LOCKED. 3-card row showing default + hover + default with variant chips and full-width ADD TO BAG |
| `000035` | Filter sidebar — fully expanded | LOCKED. All 6 sections open including price slider and FEATURES |
| `000036` | SEO outro | LOCKED. 2-column body copy + FAQ accordion + related categories |
| `000037` | Brand PLP — ZYN | LOCKED. Branded hero band + brand-narrowed grid + cross-sell strip |
| `000038` | Brand PLP — KILLA | LOCKED. Same template, edgy industrial mood, X-STRONG-default sort |

### B.4 Category Pages (PLP) — Mobile

| Gen # | Section | Description |
|-------|---------|-------------|
| `000039` | Mobile Mother PLP — default | 2-column grid, sticky FILTER/SORT bar, circular "+" quick-add |
| `000040` | Mobile filter drawer | Bottom-sheet pattern, expand/collapse sections, sticky APPLY with running count |
| `000041` | Mobile sort drawer | Smaller bottom-sheet, single-select radio, descriptive sublabels |
| `000042` | Mobile empty state | Single-column reflow with horizontal-scroll closest-matches |
| `000043` | Mobile quick-add modal | Variant chips + quantity stepper + BYO Box upsell hint + ADD TO BAG sticky |

### B.5 Product Detail Pages (PDP) — Desktop

| Gen # | Section | Description |
|-------|---------|-------------|
| `000044` | Default PDP — ZYN Cool Mint 6mg | LOCKED. Foundation template. 50/50 split, gallery + 4 thumbs, full info panel with variants, dual CTA, trust strip. |
| `000045` | Scrolled state | LOCKED. Sticky compact PDP header, accordion stack (Description expanded), Pairs Well With strip, About ZYN brand tease. |
| `000046` | Variant-switching state | LOCKED. Cool Mint → Cinnamon transition. URL update, gallery refresh, content fade-in, "CONTENT UPDATED" tag. |
| `000047` | Reviews section | LOCKED. Aggregate 4.8/5 + star distribution bar chart + filter chips + 3 full review cards + pagination. |

### B.6 Product Detail Pages (PDP) — Mobile

| Gen # | Section | Description |
|-------|---------|-------------|
| `000048` | (timeout — unused) | DISCARD. Service timed out, no image generated. |
| `000049` | Mobile default PDP | LOCKED. Single-column with sticky bottom CTA bar, full-bleed gallery with dot indicators, accordion stack collapsed. |
| `000050` | Mobile gallery zoom (fullscreen) | LOCKED. Immersive fullscreen image viewer. Side-angle photo, thumbnail strip, X close + position + share. |
| `000051` | Mobile spec accordion expanded | LOCKED. Specifications expanded showing 11-row label/value spec table with Sweden flag, structured product data. |

### B.7 Cart Drawer

| Gen # | Section | Description |
|-------|---------|-------------|
| `000052` | Desktop cart with items | LOCKED. 480px right slide-in drawer. 3 items including BYO-discounted item, free-shipping progress bar at 70%, BYO upsell card, full order summary, PROCEED TO CHECKOUT with lock icon. |
| `000053` | Desktop empty state | LOCKED. Ghosted bag illustration, italic display "Your bag / is empty.", QUICK START 3-product list, OR EXPLORE links to browse/build/quiz, no checkout CTA. |
| `000054` | Mobile cart with items | LOCKED. Bottom-sheet 90% viewport, drag handle, 3 items including BYO discount, full summary, PROCEED TO CHECKOUT sticky footer. |
| `000055` | Mobile empty state — first attempt | DISCARD. Service timed out, no image generated. |
| `000056` | Mobile empty state | LOCKED. Bottom-sheet empty state with PLP visible behind. Quick Start cards + Or Explore links + Close text link. |

### B.8 Initial Direction Tests (Reference Only)

Five directional prompts were proposed at session start. The first four were rendered (gens #4-7). Direction 5 was specified but never generated because the user picked Direction 4 before we got to it.

| Gen # | Description | Status |
|-------|-------------|--------|
| `000004` | Direction 1: Acid Sport (full neon-green hero) | Reference only — not chosen |
| `000005` | Direction 2: Acid on Black (early version) | Reference only — superseded by refined version |
| `000006` | Direction 3: Editorial + acid accent | REJECTED by user — too soft for the wordmark's energy |
| `000007` | Direction 4: Drop Culture (the chosen direction) | LOCKED as the brand direction. All later renders extend this. |
| _(not rendered)_ | Direction 5: Mobile commerce triptych | Specified but skipped — user picked Direction 4 before this was generated |

### B.9 To Be Added (Pending Renders)

These page templates are specified but not yet rendered:

- BYO Box configurator — desktop, mobile, in-progress state, completed-6-of-6 state
- Search overlay — full-screen search with suggestions, recent searches, trending products
- Strength PLP (educational variant)
- Flavor PLP (sensory variant)
- Account dashboard
- Order tracking page
- Checkout flow (shipping → payment → review → confirmation)
- Brand "About" modal (triggered from Brand PLP "ABOUT BRAND" CTA)
- Hamburger menu drawer (mobile)
- Mini cart preview / post-add toast (alternative to full drawer for power-user pattern)
- 404 page
- Age verification gate (first-time visit)

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-04-28 | Claude | Initial document. Covers homepage + Mother PLP + Brand PLP + mobile. References gens #4-43. |
| 1.1 | 2026-04-28 | Claude | Audit pass. Added: motion tokens (§2.6), iconography spec with Lucide library (§5.8), form validation states (§5.2), loading/skeleton states (§5.9), image technical specs (§9.7), internationalization (§A.7), mobile hamburger menu spec (§5.5), scroll behavior unified spec (§6.9), Brand PLP "About" interaction (§6.8). Fixed typos (§1.1, WCAG ratio in §A.4) and Direction numbering in Appendix B.5. |
| 1.2 | 2026-04-28 | Claude | PDP pass. Added §5.10 PDP-Specific Components (Sticky Compact PDP Header, Variant Chip with Thumbnail, Star Distribution Chart, Spec Table, Bulk Pricing Display, Helpful Counter, Image Gallery desktop, Fullscreen Zoom mobile, Sticky Bottom CTA Bar mobile). Expanded §7.6 PDP page template with full skeleton based on gens #44-51. Added Appendix B.5/B.6 for PDP renders, renumbered Initial Direction Tests to B.7 and To Be Added to B.8. |
| 1.3 | 2026-04-28 | Claude | Cart Drawer pass. Added §5.11 Cart Drawer (full spec for desktop slide-in + mobile bottom-sheet, all contents and states including just-added/BYO-discounted/out-of-stock item variants, BYO upsell card, free-shipping progress strip, empty state). Updated §6.5 Cart Interactions to reference new spec. Added §7.7 Cart Drawer page-template entry (no dedicated /cart page — drawer is the cart). Added Appendix B.7 for cart drawer renders #52-56, renumbered Initial Direction Tests to B.8 and To Be Added to B.9. |

---

*This document will be extended as new pages and components are designed. Keep gen # references updated as new images are added to the library. When images are discarded, mark them in B.3 / B.4 with status `DISCARD` rather than removing — preserves the audit trail.*
