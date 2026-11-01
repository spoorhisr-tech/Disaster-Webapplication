# Design System

## Direction
Clean, modern, minimal, professional, and trustworthy.

The interface should help users manage emergency requests, relief resources, shelters, and volunteers efficiently. Prioritize clarity, accessibility, and ease of use.

```css
/* =========================================
   DISASTER RELIEF MANAGEMENT SYSTEM
   Global Design System
   Font: Inter
   ========================================= */

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* =========================================
   1. CSS VARIABLES
   ========================================= */

:root {
  /* Backgrounds */
  --background: #F7F9FC;
  --surface: #FFFFFF;

  /* Text */
  --text: #172033;
  --text-secondary: #5B6475;

  /* Brand Colors */
  --primary: #1D4ED8;
  --primary-hover: #1E40AF;
  --primary-light: #DBEAFE;

  --secondary: #0F766E;
  --secondary-hover: #115E59;
  --secondary-light: #CCFBF1;

  /* Status Colors */
  --success: #15803D;
  --success-light: #DCFCE7;

  --warning: #B45309;
  --warning-light: #FEF3C7;

  --error: #B91C1C;
  --error-light: #FEE2E2;

  /* Borders and Focus */
  --border: #D8DEE8;
  --focus: #2563EB;

  /* Typography */
  --font-family: 'Inter', sans-serif;

  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;

  --line-height-sm: 20px;
  --line-height-base: 24px;
  --line-height-lg: 28px;

  /* Spacing: 8px-based system */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 16px;
  --spacing-4: 24px;
  --spacing-5: 32px;
  --spacing-6: 48px;
  --spacing-7: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(23, 32, 51, 0.05);
  --shadow-md: 0 4px 12px rgba(23, 32, 51, 0.08);
  --shadow-lg: 0 10px 25px rgba(23, 32, 51, 0.12);

  /* Layout */
  --container-width: 1280px;
  --sidebar-width: 260px;
  --header-height: 64px;
}

/* =========================================
   2. GLOBAL RESET
   ========================================= */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: var(--font-family);
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  -webkit-font-smoothing: antialiased;
}

/* =========================================
   3. HEADINGS
   ========================================= */

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  color: var(--text);
  font-family: var(--font-family);
}

h1 {
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

h2 {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
}

h3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
}

p {
  margin-top: 0;
}

/* =========================================
   4. LINKS
   ========================================= */

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  color: var(--primary-hover);
}

a:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
}

/* =========================================
   5. BUTTONS
   ========================================= */

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--surface);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--background);
}

.btn-danger {
  background-color: var(--error);
  color: var(--surface);
}

.btn-danger:hover:not(:disabled) {
  background-color: #991B1B;
}

.btn:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================
   6. FORM INPUTS
   ========================================= */

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

label {
  color: var(--text);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

input,
select,
textarea {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: var(--surface);
  color: var(--text);
  font-size: 14px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

input::placeholder,
textarea::placeholder {
  color: var(--text-secondary);
  opacity: 0.8;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 1px;
}

input:disabled,
select:disabled,
textarea:disabled {
  background-color: var(--background);
  cursor: not-allowed;
}

/* =========================================
   7. CARDS AND PANELS
   ========================================= */

.card {
  padding: var(--spacing-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background-color: var(--surface);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.card-title {
  margin: 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
}

.card-description {
  margin-bottom: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

/* =========================================
   8. STATUS BADGES
   ========================================= */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
}

.badge-pending {
  background-color: var(--warning-light);
  color: #92400E;
}

.badge-approved {
  background-color: var(--primary-light);
  color: #1E40AF;
}

.badge-allocated {
  background-color: var(--secondary-light);
  color: #115E59;
}

.badge-completed {
  background-color: var(--success-light);
  color: #166534;
}

.badge-rejected {
  background-color: var(--error-light);
  color: #991B1B;
}

.badge-available {
  background-color: var(--success-light);
  color: #166534;
}

.badge-unavailable {
  background-color: var(--error-light);
  color: #991B1B;
}

.badge-shelter-full {
  background-color: var(--warning-light);
  color: #92400E;
}

/* =========================================
   9. TABLES
   ========================================= */

.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background-color: var(--surface);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background-color: var(--background);
}

th,
td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

th {
  color: var(--text-secondary);
  font-weight: 600;
}

tbody tr:hover {
  background-color: #F8FAFC;
}

tbody tr:last-child td {
  border-bottom: none;
}

/* =========================================
   10. APP LAYOUT
   ========================================= */

.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background-color: var(--surface);
  border-right: 1px solid var(--border);
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: var(--spacing-5);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-5);
}

.page-header h1 {
  margin-bottom: 0;
}

.muted {
  color: var(--text-secondary);
}

/* =========================================
   11. ACCESSIBILITY
   ========================================= */

:focus-visible {
  outline-color: var(--focus);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* =========================================
   12. RESPONSIVE DESIGN
   ========================================= */

@media (max-width: 1023px) {
  :root {
    --sidebar-width: 220px;
  }

  .main-content {
    padding: var(--spacing-4);
  }
}

@media (max-width: 639px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .main-content {
    padding: var(--spacing-3);
  }

  h1 {
    font-size: 28px;
    line-height: 36px;
  }

  .card {
    padding: var(--spacing-3);
  }

  .page-header {
    align-items: flex-start;
  }
}
```


### Color Usage
- Background: Main page background.
- Surface: Cards, forms, and panels.
- Primary: Main actions and important buttons.
- Secondary: Supporting actions and visual accents.
- Success: Completed operations and successful messages.
- Warning: Pending requests and limited resource availability.
- Error: Failed operations and validation errors.
- Border: Input borders, card outlines, and separators.
- Focus: Visible keyboard-focus indicators.

Do not communicate status using color alone. Include readable status labels.

## Typography
Font: Inter, with a system sans-serif fallback.

H1: 32px / 40px / Bold
H2: 24px / 32px / Semibold
H3: 20px / 28px / Semibold
Body: 16px / 24px / Regular
Small Text: 14px / 20px / Regular
Labels: 14px / 20px / Medium

Use readable font sizes and consistent heading levels.

## Spacing
Use a consistent spacing system based on 8px:

8px, 16px, 24px, 32px, 48px, 64px

Use smaller 4px increments when necessary for compact elements.

Maintain consistent spacing between sections, cards, forms, and buttons.

## Radius & Shadows
- Small radius: 4px
- Default radius: 8px
- Large radius: 12px
- Use subtle shadows for dialogs and elevated elements.
- Use consistent borders for cards, forms, and input fields.
- Avoid excessive shadows and decorative effects.

## Components

### Buttons
- Primary buttons for main actions.
- Secondary buttons for supporting actions.
- Ghost buttons for low-emphasis actions.
- Danger buttons for destructive actions.

Buttons must include hover, focus, active, disabled, and loading states where applicable.

### Inputs
- Every input must have a visible label.
- Display validation errors near the relevant field.
- Provide visible focus and disabled states.
- Use suitable input types and validation for quantities, dates, and contact information.
- Do not use placeholder text as the only label.

### Cards
- Use cards to group emergency requests, resources, shelters, and volunteer information.
- Keep card layouts consistent and easy to scan.

### Tables
- Use readable column headings and consistent spacing.
- Display loading, empty, and error states.
- Ensure tables remain usable on smaller screens.

### Status Badges
Use consistent labels and visual styles for:
- Pending
- Approved
- Allocated
- Completed
- Rejected
- Available
- Unavailable
- Shelter Full

The displayed labels must match the backend's approved status values and business rules.

### Navigation
- Keep navigation consistent across application pages.
- Clearly highlight the current page.
- Use descriptive labels.
- Support keyboard navigation and mobile layouts.

### Modals
- Use modals for confirmations and focused tasks.
- Provide clear Cancel and Confirm actions.
- Require confirmation before destructive operations.

Reuse existing components before creating new ones.

## States
All interactive components should support relevant states:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Success
- Empty
- Error
- Validation

Display clear messages when an operation succeeds or fails.

Example empty state:
"No emergency requests have been recorded yet."

## Responsive

Mobile: < 640px
- Use single-column layouts for most forms and cards.
- Keep buttons easy to tap.
- Prevent horizontal page overflow.
- Make tables usable on small screens.

Tablet: 640–1023px
- Use flexible layouts and two-column sections when appropriate.
- Keep forms and navigation readable.

Desktop: >= 1024px
- Use available space for dashboards, tables, and multi-column layouts.
- Maintain readable content widths.

Follow the existing project's responsive framework and breakpoints if already established.

## Accessibility
- Use semantic HTML elements and correct heading order.
- Ensure keyboard accessibility for all interactive elements.
- Provide visible focus indicators.
- Associate form labels with their inputs.
- Display understandable validation messages.
- Maintain sufficient text and background contrast.
- Do not rely on color alone to communicate status.
- Provide accessible names for icon-only buttons.
- Respect reduced-motion preferences.

## Project-Specific Design Rules
- Display Request IDs, request status, urgency, and location clearly where appropriate.
- Make low resource stock and full shelters easy to identify.
- Use confirmation dialogs for destructive actions.
- Do not expose sensitive information to unauthorized users.
- Use simulated data for project demonstrations.
- Do not imply integration with real emergency services unless it has been implemented and approved.

## Implementation Rules
- Read PRD.md and AGENTS.md before modifying the interface.
- Follow ARCHITECTURE.md if it exists.
- Inspect existing components before creating new ones.
- Reuse the current frontend framework and component library.
- Do not introduce new UI libraries without approval.
- Do not assume React, TypeScript, Inertia, or another framework without inspecting the existing project.